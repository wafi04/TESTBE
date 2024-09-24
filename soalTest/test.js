// soal 1
const data = "NIEGIE"
const reverse = data.split('').reverse().join('')
//  soal 2
const sentence = "Saya sangat senang mengerjakan soal algoritma"
const words = sentence.split(' ');
const longestWord = words.reduce((longWord,indexWord) => {
    return indexWord.length > longWord.length  ? indexWord : longWord
},"")

//  soal no 3
const dataInput = ['xc', 'dz', 'bbb', 'dz']  
const dataQuery = ['bbb', 'ac', 'dz']
const matchData = dataQuery.map((queryWord) => {
    return dataInput.filter((r) => r === queryWord).length
})
// soal no 4
function calculateDiagonalDifference(matrix) {
    let primaryDiagonalSum = 0;
    let secondaryDiagonalSum = 0;
    const n = matrix.length;
    for (let i = 0; i < n; i++) {
        primaryDiagonalSum += matrix[i][i];
        secondaryDiagonalSum += matrix[i][n - 1 - i];
    }
    const result = primaryDiagonalSum - secondaryDiagonalSum;
    return result;
}
const matrix = [
    [1, 2, 0],
    [4, 5, 6],
    [7, 8, 9]
];

const difference = calculateDiagonalDifference(matrix);
console.log("Hasil pengurangan dari jumlah diagonal adalah:", difference);

console.log(matchData)