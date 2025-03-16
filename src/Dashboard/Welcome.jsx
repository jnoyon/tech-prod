import React, { useContext, useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { AuthContext } from "../firebase/AuthProvider";
import { RoleContext } from "../shared/RoleContext";

const DashboardPieChart = () => {
  const [data, setData] = useState([]);
  const { user } = useContext(AuthContext);
  const {isAdmin} = useContext(RoleContext)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsRes = await fetch("https://tech-prod-server.vercel.app/products");
        const reviewsRes = await fetch("https://tech-prod-server.vercel.app/reviews");
        const usersRes = await fetch("https://tech-prod-server.vercel.app/users");

        if (!productsRes.ok || !reviewsRes.ok || !usersRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const products = await productsRes.json();
        const reviews = await reviewsRes.json();
        const users = await usersRes.json();

        const acceptedProducts = products.filter((p) => p.status === true).length;
        const pendingProducts = products.filter((p) => p.status === false).length;
        const totalReviews = reviews.length;
        const totalUsers = users.length;

        const chartData = [
          { name: "Accepted Products", value: acceptedProducts },
          { name: "Pending Products", value: pendingProducts },
          { name: "Total Reviews", value: totalReviews },
          { name: "Total Users", value: totalUsers },
        ];

        setData(chartData);
      } catch (error) {
        console.log(error)
      }
    };

    fetchData();
  }, []);

  const COLORS = ["#0088FE", "#FFBB28", "#00C49F", "#FF8042"];

  return (
    <div className="flex flex-col items-center my-10 w-full">
      <h2 className="text-2xl font-bold mb-5"> Welcome, {user.displayName} </h2>
      {isAdmin && <div className="w-full max-w-4xl h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>}
      

    </div>
  );
};

export default DashboardPieChart;
