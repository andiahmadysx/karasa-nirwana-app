export const formatCurrency = (value, isSpacing = true) => {
    return value ? isSpacing ? 'Rp. ' + value.toLocaleString() : 'Rp.' + value.toLocaleString() : 0;
}
