export default {
    methods: {
        getImageColor(image) {
            return new Promise((resolve, reject) => {
                var blockSize = 5,
                    defaultRGB = { r: 0, g: 0, b: 0 },
                    bottom_threshold = 50,
                    top_threshold = 240,
                    canvas = document.createElement("canvas"),
                    context = canvas.getContext && canvas.getContext("2d"),
                    data,
                    width,
                    height,
                    img = new Image(),
                    i = -4,
                    length,
                    rgb = { r: 0, g: 0, b: 0 },
                    count = 0;

                if (!context) {
                    return defaultRGB;
                }

                height = canvas.height = image.height;
                width = canvas.width = image.width;

                img.crossOrigin = "anonymous";
                img.src = image.url;
                img.onload = () => {
                    context.drawImage(img, 0, 0);

                    try {
                        data = context.getImageData(0, 0, width, height);
                    } catch (e) {
                        reject(defaultRGB);
                    }

                    length = data.data.length;

                    while ((i += blockSize * 4) < length) {
                        if (!(data.data[i] < bottom_threshold && data.data[i + 1] < bottom_threshold && data.data[i + 2] < bottom_threshold)) {
                            if (data.data[i] < top_threshold && data.data[i + 1] < top_threshold && data.data[i + 2] < top_threshold) {
                                ++count;
                                rgb.r += data.data[i];
                                rgb.g += data.data[i + 1];
                                rgb.b += data.data[i + 2];
                            }
                        }
                    }

                    rgb.r = ~~(rgb.r / count);
                    rgb.g = ~~(rgb.g / count);
                    rgb.b = ~~(rgb.b / count);

                    resolve(rgb);
                };
            });
        },
    },
};
