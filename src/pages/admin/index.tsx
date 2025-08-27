import React, { useCallback, useState } from "react";
import type { NextPage } from "next";
import { Column, DataTable } from "@/components/dataTable";
import { ReportsApi } from "delfruit-swagger-cg-sdk";
import { Config } from "@/utils/config";
import Head from "next/head";
import Header from "@/components/header";
import Link from "next/link";

const CFG: Config = require("@/config.json");

const REPORTSAPI: ReportsApi = new ReportsApi(void 0, CFG.apiURL.toString());

const reportColumns: Column<Report>[] = [
    { key: "id", label: "Report ID", render: (v, row) => <p>{v}</p> },
    { key: "type", label: "Type", render: (v, row) => <p>{v}</p> },
    { key: "targetId", label: "Target", render: (v, row) => <p>{v}</p> },
    { key: "report", label: "Details", render: (v, row) => <p>{v}</p> },
    { key: "reporterName", label: "Reported By", render: (v, row) => <p>{v}</p> },

    { key: "dateCreated", label: "Date", render: (v, row) => <p>{v}</p> },
    { key: "dateAnswered", label: "Answered At", render: (v, row) => <p>{v}</p> },
    {
        key: "answeredByName",
        label: "Answered By",
        render: (v, row) => <p>{v}</p>,
    },
];

export default function AdminDashboard(): NextPage {
    const [reports, setReports] = useState<Array<Report>>([]);

    const fetchReports = useCallback(async () => {
        const resp = await REPORTSAPI.getReports(0, 100);
        return resp.data;
    }, []);

    return (
        <>
            <Head>
                <title>Delicious Fruit</title>
            </Head>
            <div id="container">
                <Header />
                <div id="content">
                    <h2>Admin Dashboard</h2>
                    <div className="overflow-x-auto">
                        <DataTable
                            data={reports}
                            columns={reportColumns}
                            sortConfig={null}
                            onSortChange={() => { }}
                            loaderRef={null}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
