export function generateEmployeeId() {
    const randomNumber = Math.floor(1000000 + Math.random() * 9000000);

    return `EMP${randomNumber}`;
}