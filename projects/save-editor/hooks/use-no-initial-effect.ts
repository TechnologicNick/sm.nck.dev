import { DependencyList, EffectCallback, useEffect, useRef } from "react";

const useNoInitialEffect = (effect: EffectCallback, deps?: DependencyList) => {
  const isInitial = useRef(true);

  useEffect(() => {
    if (isInitial.current) {
      isInitial.current = false;
    } else {
      return effect();
    }
  }, deps);
}

export default useNoInitialEffect;
