import { useSelector, useDispatch } from "react-redux";
import { fetchProvince } from "../slices/provinceSlice";
import { useEffect } from "react";

function useProvince() {
  const { provinces } = useSelector((state) => state.province);
  const dispatch = useDispatch();

  useEffect(() => {
    if (provinces.length == 0) {
      dispatch(fetchProvince());
    }
  }, [provinces]);
}

export default useProvince;
