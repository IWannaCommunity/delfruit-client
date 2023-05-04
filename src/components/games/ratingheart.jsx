export default function RatingHeart({ filled }) {
    let color = "#E4E4E4";
    if (filled) {
        color = "#D63636";
    }
    return (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2.51487C18.6572 -4.48017 35.3016 7.76039 12 23.5C-11.3016 7.76192 5.34282 -4.48017 12 2.51487Z" fill={color} />
    </svg>);
}
