import robotBase from "../assets/robot-base.png";
import cardFront from "../assets/card-front.png";
import moneyBag from "../assets/money-bag.jpg";

const RobotCardAnimation = () => {
  return (
    <div className="relative w-full overflow-hidden" style={{ aspectRatio: "1338 / 1348" }}>
       <div className="hand-enter absolute inset-0">
        <div className="hand-idle w-full h-full">
          <img
            src={robotBase}
            alt="finance-robot-hand"
            className="w-full h-full object-contain pointer-events-none select-none"
          />
        </div>
      </div>

      {/* Card: fades + scales in after the hand lands, then flips forever */}
      <div
        className="card-enter absolute"
        style={{
          left: "0%",
          top: "10.2%",
          width: "90.5%",
          height: "70.7%",
          perspective: "1600px",
        }}
      >
        <div className="flip-card">
          <div className="flip-card-inner">
            {/* Front face: real card */}
            <div className="flip-card-face flip-card-front">
              <img
                src={cardFront}
                alt="bank-card"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Back face: actual money bag image, arrives already spinning */}
            <div className="flip-card-face flip-card-back">
              <img
                src={moneyBag}
                alt="money-bag"
                className="money-bag-spin w-2/3 h-2/4 object-contain "
              />
            </div>
          </div>

          {/* Blink/flash at the exact moment the card flips */}
          <div className="flip-card-blink" />
        </div>
      </div>

      <style>{`
        /* 1. Hand entrance: slides in from the right */
        @keyframes handSlideIn {
          0% { transform: translateX(140%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        .hand-enter {
          animation: handSlideIn 1s cubic-bezier(0.22, 0.9, 0.32, 1) forwards;
        }

        /* 2. Hand idle: subtle float/tilt once it has landed — simulates movement */
        @keyframes handIdle {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(-1.5deg); }
        }
        .hand-idle {
          animation: handIdle 3.2s ease-in-out 1s infinite;
        }

        /* 3. Card entrance: fades + scales in right after the hand lands */
        @keyframes cardEnter {
          0% { opacity: 0; transform: scale(0.85) translateY(-10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .card-enter {
          opacity: 0;
          animation: cardEnter 0.7s ease-out 0.9s forwards;
        }

        /* 4. Card flip loop: starts only after entrance is fully done */
        .flip-card { position: relative; width: 100%; height: 100%; }
        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          animation: cardFlip 6s ease-in-out 1.8s infinite;
        }
        .flip-card-face {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .flip-card-back {
          transform: rotateY(180deg);
        }
        @keyframes cardFlip {
          0%, 38% { transform: rotateY(0deg); }
          50%, 88% { transform: rotateY(180deg); }
          100% { transform: rotateY(360deg); }
        }

        /* 5. Money bag: plain rotation while fading in, small bounce-settle, no glow/color */
        .money-bag-spin {
          transform-origin: 50% 50%;
          animation: moneyBagSpin 6s cubic-bezier(0.34, 1.56, 0.64, 1) 1.8s infinite;
        }
        @keyframes moneyBagSpin {
          0%, 38% {
            transform: rotate(0deg) scale(0.5);
            opacity: 0;
          }
          46% {
            transform: rotate(360deg) scale(1.08);
            opacity: 1;
          }
          52%, 88% {
            transform: rotate(360deg) scale(1);
            opacity: 1;
          }
          94% {
            transform: rotate(620deg) scale(0.6);
            opacity: 0;
          }
          100% {
            transform: rotate(620deg) scale(0.5);
            opacity: 0;
          }
        }

        /* 6. Blink: a quick white flash exactly when the card flips (both directions) */
        .flip-card-blink {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 70%);
          mix-blend-mode: screen;
          opacity: 0;
          animation: flipBlink 6s ease-in-out 1.8s infinite;
        }
        @keyframes flipBlink {
          0%, 36% { opacity: 0; }
          43% { opacity: 0.9; }
          50%, 86% { opacity: 0; }
          93% { opacity: 0.9; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default RobotCardAnimation;