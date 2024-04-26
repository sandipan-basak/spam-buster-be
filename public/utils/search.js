"use strict";
// export function customSort (data, search) {
//   return data.sort((a, b) => {
//     // Normalize search term and items for case insensitive comparison
//     const lowA = a.toLowerCase();
//     const lowB = b.toLowerCase();
//     const lowSearch = search.toLowerCase();
//     // Check if starts with exact match
//     const startA = a.startsWith(search) ? 0 : 1;
//     const startB = b.startsWith(search) ? 0 : 1;
//     // Check for exact substring and position
//     const posA = lowA.indexOf(lowSearch);
//     const posB = lowB.indexOf(lowSearch);
//     // Check case-sensitive appearance
//     const exactMatchA = a.includes(search) ? 0 : 1;
//     const exactMatchB = b.includes(search) ? 0 : 1;
//     if (startA !== startB) {
//       // Prioritize strings that start with 'Sarthak'
//       return startA - startB;
//     } else if (exactMatchA !== exactMatchB) {
//       // Within those that start with 'Sarthak', prioritize case-sensitive matches
//       return exactMatchA - exactMatchB;
//     } else if (posA !== posB) {
//       // Then prioritize by the position of 'Sarthak' in the string
//       return posA - posB;
//     } else {
//       // Finally, sort alphabetically
//       return a.localeCompare(b);
//     }
//   });
// }
// const names = ['Sarthak', 'Sartha', 'sarthak', 'asbsarthak', 'abcsarthasd'];
// const searchTerm = 'Sarthak';
// const sortedNames = customSort(names, searchTerm);
// console.log(sortedNames);
