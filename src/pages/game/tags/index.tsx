import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import Footer from "@/components/footer";
import Tag from "@/components/game/tag";
import Header from "@/components/header";
import Whitespace from "@/components/whitespace";
import { API } from "@/utils/api";
import type { AnyElem } from "@/utils/element";
import { useEffectAsync, useSessionContext } from "@/utils/hooks";

export default function Tags(): AnyElem {
    const [tags, setTags] = useState([]);
    const [session, _] = useSessionContext();

    useEffectAsync(async () => {
        setTags(
            (
                await API.tags().getAllTags({
                    headers: { Authorization: `Bearer ${session.token}` },
                })
            ).data,
        );
    }, async () => { }, [session]);

    return (
        <div>
            <Head>
                <title>Delicious Fruit</title>
            </Head>
            <div id="container">
                <Header />
                <div id="content">
                    <p>If nothing appears here after a second, then try logging in.</p>
                    <>
                        {tags.map((t) => {
                            return <Tag key={t.id} id={t.id} name={t.name} count={0} />;
                        })}
                    </>
                </div>
                <Footer />
            </div>
        </div>
    );
}
