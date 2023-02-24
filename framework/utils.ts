export function awaitElement(id: string): Promise<HTMLElement> {
    return new Promise((resolve) => {
        let timer = setInterval(() => {
            const el = document.getElementById(id);
            if (el != null) {
                clearInterval(timer);
                resolve(el);
            }
        }, 100);
    });
}
