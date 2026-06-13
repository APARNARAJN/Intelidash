from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import ollama
import re

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000", "http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

SCHEMA = """
Table: sales
Columns:
  - id (integer, primary key)
  - order_date (date)
  - region (varchar) — 'North', 'South', 'East', 'West'
  - product (varchar) — 'Laptop Pro', 'Monitor 4K', 'Wireless Mouse', 'Keyboard Mech', 'Office Chair', 'Standing Desk'
  - category (varchar) — 'Electronics', 'Furniture'
  - quantity (integer)
  - unit_price (numeric)
  - revenue (numeric)
"""

SYSTEM_PROMPT = f"""You are a PostgreSQL expert. Convert natural language questions into valid PostgreSQL SELECT queries.

Database schema:
{SCHEMA}

Rules:
1. Return ONLY the raw SQL query — no explanation, no markdown, no backticks, no preamble.
2. Only SELECT queries. Never use INSERT, UPDATE, DELETE, DROP, TRUNCATE.
3. For monthly grouping use DATE_TRUNC('month', order_date) aliased as "month".
4. Always include ORDER BY.
5. Always end with LIMIT 50.
6. Use simple lowercase aliases with underscores: total_revenue, avg_price, month, region.
7. Always output exactly two columns: one for labels (x-axis), one for values (y-axis).
"""

BLOCKED = ["insert", "update", "delete", "drop", "truncate", "alter", "create"]

def is_safe(sql: str) -> bool:
    lower = sql.lower()
    return not any(kw in lower for kw in BLOCKED)

def extract_sql(raw: str) -> str:
    raw = raw.strip()
    raw = re.sub(r"```sql|```", "", raw).strip()
    raw = re.sub(r"(?i)^(here is|here's|the query|sql:|query:)[^\n]*\n", "", raw).strip()
    if not raw.lower().startswith("select"):
        match = re.search(r"(SELECT .+?)(?:;|$)", raw, re.IGNORECASE | re.DOTALL)
        if match:
            raw = match.group(1)
    return raw.strip().rstrip(";") + ";"

def guess_chart_type(question: str) -> str:
    q = question.lower()
    if any(w in q for w in ["trend", "over time", "monthly", "weekly", "daily"]):
        return "line"
    return "bar"

def guess_keys(sql: str):
    select_match = re.search(r"SELECT(.+?)FROM", sql, re.IGNORECASE | re.DOTALL)
    if select_match:
        select_part = select_match.group(1)
        # Get all column names/aliases
        aliases = re.findall(r'(?:AS\s+)?(\w+)\s*(?:,|$)', select_part, re.IGNORECASE)
        aliases = [a for a in aliases if a.upper() not in ("AS", "SUM", "AVG", "COUNT", "MAX", "MIN")]
        if len(aliases) >= 2:
            return aliases[0], aliases[1]
    return "region", "total_revenue"
class QueryRequest(BaseModel):
    question: str

class QueryResponse(BaseModel):
    sql: str
    question: str
    chart_type: str
    x_key: str
    y_key: str

@app.post("/generate-sql", response_model=QueryResponse)
async def generate_sql(req: QueryRequest):
    if not req.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    try:
        response = ollama.chat(
            model="llama3.2",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": req.question}
            ]
        )
        raw = response["message"]["content"]
        sql = extract_sql(raw)

        if not is_safe(sql):
            raise HTTPException(status_code=400, detail="Unsafe SQL detected")

        chart_type = guess_chart_type(req.question)
        x_key, y_key = guess_keys(sql)

        return QueryResponse(
            sql=sql,
            question=req.question,
            chart_type=chart_type,
            x_key=x_key,
            y_key=y_key
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")

@app.get("/health")
def health():
    return {"status": "ok", "model": "llama3.2"}