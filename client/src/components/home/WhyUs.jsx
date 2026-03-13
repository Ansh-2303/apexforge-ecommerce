import "./WhyUs.css";
import { Zap, Truck, ShieldCheck, Gamepad2 } from "lucide-react";

const features = [
  {
    icon: <Zap size={28} />,
    title: "Precision Performance",
    text: "Gaming peripherals engineered for accuracy, speed and competitive performance."
  },
  {
    icon: <Truck size={28} />,
    title: "Fast Delivery",
    text: "Reliable and lightning-fast shipping across India with trusted logistics partners."
  },
  {
    icon: <ShieldCheck size={28} />,
    title: "Secure Checkout",
    text: "End-to-end encrypted payments with trusted gateways for safe transactions."
  },
  {
    icon: <Gamepad2 size={28} />,
    title: "Built for Gamers",
    text: "Curated gaming gear designed for serious players and esports enthusiasts."
  }
];

const WhyUs = () => {
  return (
    <section className="why-section">

      <div className="container">

        <div className="why-header">

          <h2>Why ApexForge</h2>

          <p>
            Premium gaming gear built for speed, precision and reliability.
          </p>

        </div>

        <div className="why-grid">

          {features.map((item, i) => (

            <div key={i} className="why-card">

              <div className="why-icon">
                {item.icon}
              </div>

              <h3>{item.title}</h3>

              <p>{item.text}</p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
};

export default WhyUs;