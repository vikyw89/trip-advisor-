import { ExploreCard } from "@/components/ExploreCard";

export default function Page(){
    return (
        <main>
            <ExploreCard props={{
                id: "ddd",
                name: "Tokyo",
                imageUrl: "https://www.rappler.com/tachyon/2022/12/tokyo-guide-december-20-2022.jpg"
            }}/>
        </main>
    )
}