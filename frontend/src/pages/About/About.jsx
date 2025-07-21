import React from "react";

import "./About.scss";

export const About = () => {
	const [size, setSize] = React.useState({});
    const ref = React.useRef(window);
    const baseSizeList = [767, 1440];

    const resizeHandler = () => {
        let { innerHeight, innerWidth } = ref.current || {};
        for (let baseSize of baseSizeList) {
            if (baseSize >= innerWidth) {
                innerWidth = baseSize
                break;
            }
        }
        if (innerWidth > baseSizeList[baseSizeList.length - 1]) {
            innerWidth = baseSizeList[baseSizeList.length - 1];
        }
        setSize({ innerHeight, innerWidth });
    };

    React.useEffect(() => {
        window.addEventListener("resize", resizeHandler);
        resizeHandler();
        return () => {
            window.removeEventListener("resize", resizeHandler);
        };
    }, [])

let HTMLsizeChoiser = new Map();
    HTMLsizeChoiser.set(1440,         
        <main className="about">
			<div className="about__container">
				<div className="about__text-body text-body">
					<p className="text-body__title">About us:</p>
					<p className="text-body__paragraph">
						Morent is the leading online car rental service in Ukraine, providing a reliable and convenient solution for everyone who wants a high quality
						car at an affordable price. Our team is committed to providing you with an unforgettable traveling experience by providing the most modern and
						diverse cars from the world's leading manufacturers.
					</p>
					<div>
						<p className="text-body__title">Our services:</p>
						<ul className="text-body__list list" >
							<li className="list__item">
								Wide range of cars: We offer a variety of car categories, from small and economical models to premium and SUVs. We have a car for every need and taste.				
							</li>
							<li className="list__item">
								Easy booking process: We have simplified the car rental process so that you can quickly and easily make a reservation right on our
								website. Our intuitive interface allows you to select the date, time and pickup location in just a few clicks.
							</li>
							<li className="list__item">
								Guaranteed quality: Every vehicle in our fleet is thoroughly inspected before being handed over to the customer. We guarantee the safety
								and reliability of our autos to make your journey as comfortable and carefree as possible.
							</li>
							<li className="list__item">
								Superior customer service: Our customer service team is always available to assist you with any questions or queries you may have. We
								value every customer and strive to provide the highest level of service.
							</li>
						</ul>
					</div>
					<p className="text-body__title">Why choose Morent:</p>
					<p className="text-body__paragraph">
						Morent is not just a car rental website, it is your faithful companion in traveling around Ukraine. We aim to make your journey comfortable
						and unforgettable. You no longer need to worry about transportation - Morent will take care of it. We guarantee honest and transparent prices,
						as well as reliability and quality of our vehicles.
					</p>
					<p className="text-body__paragraph">
						So don't waste time - visit Morent today and start planning your next adventure with us! Travel freely, travel with Morent.
					</p>
				</div>
			</div>
		</main>
    )
	
	function toggleSpoilerState(e){
		e.currentTarget.classList.add("current");
		let elemet = document.querySelector(".current+.spoiler-body");
		elemet.classList.toggle("open");
		e.currentTarget.classList.remove("current");
	}

	HTMLsizeChoiser.set(767, 
		<main className="about">
			<div className="about__container">
				<div className="about__text-body text-body">
					<p className="text-body__title">About us:</p>
					<p className="text-body__paragraph">
						Morent is the leading online car rental service in Ukraine, providing a reliable and convenient solution for everyone who wants a high quality
						car at an affordable price. Our team is committed to providing you with an unforgettable traveling experience by providing the most modern and
						diverse cars from the world's leading manufacturers.
					</p>
					<div>
						<p className="text-body__title">Our services:</p>
						<ul className="text-body__list list" >
							<li className="list__item">
								<div className="spoiler-block" onClick={toggleSpoilerState}>
									<p>Wide range of cars:</p>
									<div className="spoiler-block__icon">
										<img src={"./iconsfont/arrow-bottom.svg"} alt=""/>
									</div>
								</div>
								<div className="spoiler-body">
									<p>We offer a variety of car categories, from small and economical models to premium and SUVs. We have a car for every
									need and taste.</p>
								</div>								
							</li>
							<li className="list__item">
								<div className="spoiler-block" onClick={toggleSpoilerState}>
									<p>Easy booking process:</p>
									<div className="spoiler-block__icon">
										<img src={"./iconsfont/arrow-bottom.svg"} alt=""/>
									</div>
								</div>
								<div className="spoiler-body">
									<p>
										We have simplified the car rental process so that you can quickly and easily make a reservation right on our
										website. Our intuitive interface allows you to select the date, time and pickup location in just a few clicks.
									</p>
								</div>
									
							</li>
							<li className="list__item">
								<div className="spoiler-block" onClick={toggleSpoilerState}>
									<p>Guaranteed quality:</p>
									<div className="spoiler-block__icon">
										<img src={"./iconsfont/arrow-bottom.svg"} alt=""/>
									</div>
								</div>
								<div className="spoiler-body">
									<p>
										Every vehicle in our fleet is thoroughly inspected before being handed over to the customer. We guarantee the safety
										and reliability of our autos to make your journey as comfortable and carefree as possible.
									</p>
								</div>
									
							</li>
							<li className="list__item">
								<div className="spoiler-block" onClick={toggleSpoilerState}>
									<p>Superior customer service:</p>
									<div className="spoiler-block__icon">
										<img src={"./iconsfont/arrow-bottom.svg"} alt=""/>
									</div>
								</div>
								<div className="spoiler-body">
									<p>
										Our customer service team is always available to assist you with any questions or queries you may have. We
										value every customer and strive to provide the highest level of service.
									</p>
								</div>
							</li>
						</ul>
					</div>
					<p className="text-body__title">Why choose Morent:</p>
					<p className="text-body__paragraph">
						Morent is not just a car rental website, it is your faithful companion in traveling around Ukraine. We aim to make your journey comfortable
						and unforgettable. You no longer need to worry about transportation - Morent will take care of it. We guarantee honest and transparent prices,
						as well as reliability and quality of our vehicles.
					</p>
					<p className="text-body__paragraph">
						So don't waste time - visit Morent today and start planning your next adventure with us! Travel freely, travel with Morent.
					</p>
				</div>
			</div>
		</main>
	);

	return (
        HTMLsizeChoiser.get(size.innerWidth)
    )
};
