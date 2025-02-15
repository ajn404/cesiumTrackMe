// src/routes/RouteRenderer.js
import React from "react";
import { Routes, Route } from "react-router";
import { Layout } from "../components/Layout"
import { Home } from "../pages/home"

export function RouteRenderer({ routes }) {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                {routes.map((group) => {
                    if (group.items) {
                        return group.items.map((item) => (
                            <Route key={item.path} path={item.path} element={<item.element />} />
                        ));
                    }
                    return (
                        <Route key={group.path} path={group.path} element={<group.element />} />
                    );
                })}
            </Route>
        </Routes>
    );
}