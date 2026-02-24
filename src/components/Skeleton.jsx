import "../styles/skeleton.css";

function Skeleton({ type }) {
    if (type === "product") {
        return (
            <div className="skeleton-card">
                <div className="skeleton-image"></div>
                <div className="skeleton-info">
                    <div className="skeleton-text skeleton-title"></div>
                    <div className="skeleton-text skeleton-brand"></div>
                    <div className="skeleton-text skeleton-price"></div>
                </div>
            </div>
        );
    }

    return <div className={`skeleton ${type}`}></div>;
}

export default Skeleton;
