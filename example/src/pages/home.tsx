import React from "react";
import { motion } from "motion/react";

type SpotlightProps = {
    gradientFirst?: string;
    gradientSecond?: string;
    gradientThird?: string;
    translateY?: number;
    width?: number;
    height?: number;
    smallWidth?: number;
    duration?: number;
    xOffset?: number;
};


export function Home() {
    return (
        <div className="h-full w-full rounded-md flex md:items-center md:justify-center bg-black/[0.8] antialiased bg-grid-white/[0.02] relative overflow-hidden">
            <Spotlight />
            <div className=" p-4 max-w-full  mx-auto relative z-10  w-full pt-20 md:pt-0">
                <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
                    cesium沉淀 <br /> a mono repo for cesium
                </h1>
                <p className="mt-4 font-normal text-base text-neutral-300 max-w-full text-center mx-auto">
                    cesium-hooks 是一个基于 Cesium 的 React Hooks 库，提供了一系列的 React Hooks 来简化 Cesium 的使用。
                  
                </p>
                <p className="mt-4 font-normal text-base text-neutral-300 max-w-full text-center mx-auto">
                    本站点是 cesium-hooks 的文档站点，你可以在这里查看 cesium-hooks 的文档，学习如何使用 cesium-hooks。
                </p>
            </div>
        </div>
    );
}

export const Spotlight = ({
    gradientFirst = "radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(210, 100%, 85%, .2) 0, hsla(210, 100%, 55%, .1) 50%, hsla(210, 100%, 45%, 0) 80%)",
    gradientSecond = "radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .15) 0, hsla(210, 100%, 55%, .1) 80%, transparent 100%)",
    gradientThird = "radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .1) 0, hsla(210, 100%, 45%, .08) 80%, transparent 100%)",
    translateY = -350,
    width = 560,
    height = 1380,
    smallWidth = 240,
    duration = 3,
    xOffset = 200,
}: SpotlightProps = {}) => {
    return (
        <motion.div
            initial={{
                opacity: 0,
            }}
            animate={{
                opacity: 1,
            }}
            transition={{
                duration: 1.5,
            }}
            className="pointer-events-none absolute inset-0 h-full w-full"
        >
            <motion.div
                animate={{
                    x: [0, xOffset, 0],
                }}
                transition={{
                    duration,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                }}
                className="absolute top-0 left-0 w-screen h-screen z-40 pointer-events-none"
            >
                <div
                    style={{
                        transform: `translateY(${translateY}px) rotate(-45deg)`,
                        background: gradientFirst,
                        width: `${width}px`,
                        height: `${height}px`,
                    }}
                    className={`absolute top-0 left-0`}
                />

                <div
                    style={{
                        transform: "rotate(-45deg) translate(5%, -50%)",
                        background: gradientSecond,
                        width: `${smallWidth}px`,
                        height: `${height}px`,
                    }}
                    className={`absolute top-0 left-0 origin-top-left`}
                />

                <div
                    style={{
                        transform: "rotate(-45deg) translate(-180%, -70%)",
                        background: gradientThird,
                        width: `${smallWidth}px`,
                        height: `${height}px`,
                    }}
                    className={`absolute top-0 left-0 origin-top-left`}
                />
            </motion.div>

            <motion.div
                animate={{
                    x: [0, -xOffset, 0],
                }}
                transition={{
                    duration,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                }}
                className="absolute top-0 right-0 w-screen h-screen z-40 pointer-events-none"
            >
                <div
                    style={{
                        transform: `translateY(${translateY}px) rotate(45deg)`,
                        background: gradientFirst,
                        width: `${width}px`,
                        height: `${height}px`,
                    }}
                    className={`absolute top-0 right-0`}
                />

                <div
                    style={{
                        transform: "rotate(45deg) translate(-5%, -50%)",
                        background: gradientSecond,
                        width: `${smallWidth}px`,
                        height: `${height}px`,
                    }}
                    className={`absolute top-0 right-0 origin-top-right`}
                />

                <div
                    style={{
                        transform: "rotate(45deg) translate(180%, -70%)",
                        background: gradientThird,
                        width: `${smallWidth}px`,
                        height: `${height}px`,
                    }}
                    className={`absolute top-0 right-0 origin-top-right`}
                />
            </motion.div>
        </motion.div>
    );
};
