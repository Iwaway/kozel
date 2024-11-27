import axios from "axios";
import { useEffect, useState } from "react";
import { useUtils } from "../../utils/useUtils";
import { useDispatch } from "react-redux";
import {setUser} from '../../app/features/userSlice';
import { useTranslation } from "react-i18next";

export function useLogin() {
    const [captchaId, setCaptchaId] = useState<string>();
    const [error, setError] = useState<string>();
    const [form, setForm] = useState<"login" | "signin">("login");

    const { navigateTo } = useUtils();
    const dispatch = useDispatch();
    const { t } = useTranslation();
  
    const getCaptcha = async () =>{
      const result = await axios.post('http://localhost:80/getCaptcha');
      const captchaBlock = document.getElementById('captchaBlock');
      const parser = new DOMParser();
      setCaptchaId(result.data.id);
      const svg = parser.parseFromString(result.data.captcha, "image/svg+xml").documentElement;
      if (captchaBlock?.lastChild) {
        captchaBlock?.removeChild(captchaBlock.lastChild);
      }
      captchaBlock?.appendChild(svg);
    };
  
    useEffect(() => {
      getCaptcha();
    }, [form, error]);
    
    const submitLoginForm = async () => {
      const result = await axios.post('http://localhost:80/auth', {
        email: (document.getElementById("email") as HTMLInputElement).value,
        password: (document.getElementById("password") as HTMLInputElement).value,
        answer: (document.getElementById("captchaAnswer") as HTMLInputElement).value,
        captchaId: captchaId,
      });
  
      if(result.data.status !== "ok") {
        console.log(result.data);
        setError(result.data.message);
      } else {
        console.log(result.data);
        dispatch(setUser({id: result.data.data.id, token: result.data.data.token, nickname: result.data.data.nickname}));
        navigateTo('/');
      }
    };

    const submitSignForm = async () => {
      const result = await axios.post('http://localhost:80/register', {
        email: (document.getElementById("email") as HTMLInputElement).value,
        password: (document.getElementById("password") as HTMLInputElement).value,
        answer: (document.getElementById("captchaAnswer") as HTMLInputElement).value,
        nickname: (document.getElementById("nickname") as HTMLInputElement).value,
        captchaId: captchaId,
      });
  
      if(result.data.status !== "ok") {
        console.log(result.data);
        setError(result.data.message);
      } else {
        console.log(result.data);
        dispatch(setUser({id: result.data.data.id, token: result.data.data.token, nickname: result.data.data.nickname}));
        navigateTo('/');
      }
    };

    return {
        form,
        setForm,
        error,
        t,
        submitLoginForm,
        submitSignForm,
    };
};