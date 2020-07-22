// 生成验证码图片src
const getCodeSrc = () => {
  const src = faceConfig.basePath + '/CaptchaImg?r=' + Math.random()
  return src
}

export default getCodeSrc
