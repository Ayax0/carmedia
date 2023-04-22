export default {
    methods: {
        getImageColor(image) {
            return new Promise((resolve, reject) => {
                const defaultRGB = { r: 40, g: 40, b: 40 };
                const blockSize = 5;
                const roundToNext = 10;
                const topThreshold = 245;
                const bottomThreshold = 60;
                const minVariance = 20;

                const dataset = [];
                const canvas = document.createElement("canvas");
                const context = canvas.getContext && canvas.getContext("2d");
                const heigth = (canvas.height = image.height || 200);
                const width = (canvas.width = image.width || 200);
                const img = new Image();

                img.crossOrigin = "anonymous";
                img.src = image.url || image;
                img.onload = () => {
                    context.drawImage(img, 0, 0);
                    try {
                        const data = context.getImageData(0, 0, width, heigth);

                        for (let i = 0; i < data.data.length - blockSize * 4; i += blockSize * 4) {
                            const r = Math.round(data.data[i] / roundToNext) * roundToNext;
                            const g = Math.round(data.data[i + 1] / roundToNext) * roundToNext;
                            const b = Math.round(data.data[i + 2] / roundToNext) * roundToNext;
                            const variance = [r, g, b].sort((a, b) => b - a);

                            if ((r + g + b) / 3 > topThreshold || (r + g + b) / 3 < bottomThreshold) continue;
                            if (Math.abs(variance[0] - variance[2]) < minVariance) continue;

                            const index = dataset.findIndex((item) => item.r == r && item.g == g && item.b == b);
                            if (index > -1) dataset[index].c++;
                            else dataset.push({ r, g, b, c: 1 });
                        }

                        dataset.sort((a, b) => b.c - a.c);
                        return resolve(dataset[0] || defaultRGB);
                    } catch (error) {
                        return reject(defaultRGB);
                    }
                };
            });
        },
    },
};
