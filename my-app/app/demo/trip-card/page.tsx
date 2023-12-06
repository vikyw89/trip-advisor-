import { TripCard } from "@/components/TripCard";

export default function Page(){
    return (<main>
        <TripCard props={{
            id: "ddd",
            destination: "Daejeon",
            endDate: "20221102",
            startDate: "20221101",
            pictureUrl: "https://images.nationalgeographic.org/image/upload/t_edhub_resource_key_image/v1638883638/EducationHub/photos/colorful-signs.jpg",
        }}/>
    </main>)
}