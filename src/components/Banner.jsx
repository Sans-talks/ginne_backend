import "../styles/banner.css";

function Banner() {
    return (
        <div className="banner">
            <div className="banner-content">
                <h1>FLAT ₹500 OFF</h1>
                <p>On your first order. Use code: <b>FIRST500</b></p>
                <button className="banner-btn">SHOP NOW</button>
            </div>
        </div>
    );
}

export default Banner;
