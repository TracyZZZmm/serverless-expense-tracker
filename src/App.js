import React, { useState } from "react";

const API_URL =
  "https://kyyauw3rm5.execute-api.us-east-1.amazonaws.com/expense";

function App() {
  const [form, setForm] = useState({ amount: "", category: "", date: "" });
  const [expenses, setExpenses] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.amount || !form.category || !form.date) {
      alert("Please fill in all fields");
      return;
    }

    if (!form.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      alert("Please enter a valid date in YYYY-MM-DD format");
      return;
    }

    // ✅ STEP 1: 打印你将要提交的数据
    console.log("Submitting payload:", {
      ...form,
      amount: parseFloat(form.amount),
    });

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        amount: parseFloat(form.amount),
      }),
    });

    const data = await res.json();

    // ✅ STEP 2: 打印 POST 返回值
    console.log("POST response:", data);

    if (!res.ok) {
      console.error("POST error:", data);
      alert(data.error || "Failed to add expense");
      return;
    }

    // ✅ STEP 3: 打印用于 GET 的 ID
    console.log("Fetching by ID:", data.id);

    const getRes = await fetch(`${API_URL}?expense_id=${data.id}`);
    const expense = await getRes.json();

    // ✅ STEP 4: 打印最终查到的 Expense
    console.log("Fetched expense:", expense);

    setExpenses([...expenses, expense]);
    setForm({ amount: "", category: "", date: "" });
  };

  const handleDelete = async (id) => {
    // ✅ 删除前打印日志
    console.log("Deleting expense ID:", id);

    await fetch(`${API_URL}?expense_id=${id}`, { method: "DELETE" });
    setExpenses(expenses.filter((e) => e.expense_id !== id));
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Expense Tracker</h2>
      <input
        name="amount"
        value={form.amount}
        onChange={handleChange}
        placeholder="Amount"
      />
      <input
        name="category"
        value={form.category}
        onChange={handleChange}
        placeholder="Category"
      />
      <input
        name="date"
        value={form.date}
        onChange={handleChange}
        placeholder="Date (YYYY-MM-DD)"
      />
      <button onClick={handleSubmit}>Add Expense</button>

      <ul>
        {expenses.map((e) => (
          <li key={e.expense_id}>
            {e.amount} - {e.category} - {e.date}
            <button onClick={() => handleDelete(e.expense_id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
