import Link from 'next/link';

const House = ({ id, title, picture, type, town, rating, reviewsCount }) => {
  return (
    <Link href="/houses/[id]" as={`/houses/${id}`}>
      <a>
        <img src={picture} width="100%" alt="House picture" />
        <p>
          {type} - {town}
        </p>
        <p>{title}</p>
        <p>
          {rating} ({reviewsCount})
        </p>
      </a>
    </Link>
  );
};

export default House;
