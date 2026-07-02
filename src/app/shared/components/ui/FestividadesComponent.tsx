import React, { FC } from "react";
import Lottie, { LottieProps } from "react-lottie";

interface PropsBase {
  gifOrImage: Record<string, any>;
  active: boolean;
}

type PropsAdd = Omit<LottieProps, "options">;

type Props = PropsBase & PropsAdd;

export const FestividadesComponent: FC<Props> = ({ gifOrImage, active, ...rest }) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: gifOrImage,
    renderSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  return (
    <>
      {active && (
        <main>
          <Lottie {...rest} options={defaultOptions} isPaused={false} />
        </main>
      )}
    </>
  );
};
