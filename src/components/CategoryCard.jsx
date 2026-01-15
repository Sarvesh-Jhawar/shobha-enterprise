import { Link } from 'react-router-dom';
import { formatName } from '../utils/formatters';
import './CategoryCard.css';

export default function CategoryCard({ category }) {
    const { id, name, image, description } = category;

    return (
        <Link to={`/category/${id}`} className="category-card">
            <div className="category-image-wrapper">
                <img src={image} alt={formatName(name)} className="category-image" loading="lazy" />
            </div>
            <span className="category-name">{formatName(name)}</span>
        </Link>
    );
}
