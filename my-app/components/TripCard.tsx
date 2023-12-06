import { z } from "zod"
import Image from "next/image"
import { useInView } from "framer-motion"
import { useRef } from "react"
export const Place = z.object({
    id: z.string(),
    name: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    picture: z.string(),
})



export const TripCardPropsSchema = z.object({
    id: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    destination: z.string(),
    pictureUrl: z.string(),
})

export type TripCardProps = z.infer<typeof TripCardPropsSchema>

export const TripCard = ({props}:{props:TripCardProps}) => {
    const ref = useRef(null)
    const isInView = useInView(ref,{amount:1})

    return (
        <div className="w-[300px] min-w-[300px] max-w-lg shadow-md h-[200px] relative rounded-box overflow-hidden ml-2" ref={ref}>
            <Image src={props.pictureUrl} alt={props.pictureUrl} fill className={`hover:scale-150 ${isInView ? "grayscale-0 scale-150" : "grayscale"} duration-300 grayscale hover:grayscale-0 hover:shadow-inner`} style={{
                objectFit: "cover",
                opacity: 0.8,
            }}/>
            <div className={`${isInView ? "flex" : "hidden"} animate-fade-up animate-once animate-ease-in-out duration-300 flex-col p-4 drop-shadow-md bottom-0 from-transparent to-black absolute w-full bg-gradient-to-b rounded-b-box`}>
                <div className="text-2xl font-extrabold mix-blend-difference text-white/70">{props.destination}</div>
                <div className="text-base  mix-blend-difference text-white/70">{props.startDate} - {props.endDate}</div>
            </div>
        </div>
    )
}