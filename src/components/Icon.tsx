"use client";
import Image from "next/image"

const Icon = ({name, width, height}:{name: string; width?: number; height?: number; className?: string})=>{
    return (
        <Image src={`/icons/${name}.svg`} width={width} height={height} alt={name} />
    )
}

export default Icon;