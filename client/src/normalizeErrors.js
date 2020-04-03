export default errors => (
    errors.reduce((acc, curr) => {
        if (curr.path in acc) {
            acc[curr.path].push(curr.message);
        } else {
            acc[curr.path] = [curr.message];
        }
    }, {})
);