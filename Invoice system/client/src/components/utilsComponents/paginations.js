function chunk(array, size) {
    if (!array.length) {
        return [];
    }
    const head = array.slice(0, size);
    const tail = array.slice(size);
    return [head, ...chunk(tail, size)];
}


export default function PaginationData(data, itemsPerPage) {
    return chunk(data, itemsPerPage);
} 