export const FormatDateMessage = (date) => {
    const regex = /(il y a|environ|moins de|moins d'|plus de)/g;
    let dateFormated = date.replace(regex, '').trim();
    return dateFormated;
};