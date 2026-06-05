export const formatPrice = (value: number): string => {
    if(value >= 10000000) {
        const cr = (value / 10000000).toFixed(1).replace(/\.0$/, "");
        return `$ ${cr} USD`;
    }
    if(value >= 100000) {
        const lac = (value / 100000).toFixed(1).replace(/\.0$/, "");
        return `$ ${lac} USD`;
    }
    return `$ ${value.toLocaleString()}`;
}
    