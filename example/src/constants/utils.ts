export const generateTrajectory = (centerLng = -117.16, centerLat = 32.71) => {
    const points = [];
    const baseTime = new Date("2024-01-01T00:00:00Z").getTime();
    for (let t = 0; t < 200; t++) {
        const angle = t * 0.1;
        const radius = 0.0005 * angle;

        // 生成坐标
        const lng =
            centerLng +
            radius * (1 + 0.3 * Math.sin(5 * angle)) * Math.cos(angle) +
            (Math.random() - 0.5) * 0.0001;

        const lat =
            centerLat +
            radius * (1 + 0.3 * Math.sin(5 * angle)) * Math.sin(angle) +
            (Math.random() - 0.5) * 0.0001;

        // 生成时间戳（每5秒一个点）
        const timestamp = baseTime + t * 5000; // 5000毫秒 = 5秒

        points.push({
            time: timestamp, // 毫秒级时间戳
            lng: Number(lng.toFixed(6)),
            lat: Number(lat.toFixed(6)),
        });
    }
    return points;
};