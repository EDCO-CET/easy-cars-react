import './Card.css';

function Card(props) {
    const { name, image, speed, "0-100": zeroToHundred, seats, price, isMostPopular } = props;
    return (
        <article className="card">
            <header className="card__head">
                <h3>{name}</h3>
                <span className="card__tag">{isMostPopular ? "Most Popular" : "Sport"}</span>
            </header>
            <img className="card--image" src={image} alt={name} />
            <ul className="card__specs">
                <li>{speed}</li>
                <li>{zeroToHundred}</li>
                <li>{seats}</li>
            </ul>
            <p className="card--price">
                <span className="card--price__amount">{`$${price}`}</span>
            </p>
            <div className="card--button-container">
                <button className="btn btn-primary" type="button">Rent</button>
                <button className="btn btn-favorite" type="button" aria-label="Add to favorites">♡</button>
            </div>
        </article>
    );
}

export default Card;
