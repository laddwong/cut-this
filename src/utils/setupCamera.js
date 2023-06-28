import { log } from "./log";

/** @type {MediaStreamConstraints} */
const DEFAULT_CONSTRAINTS = {
  audio: false, 
  video: { 
    width: window.innerWidth,
    height: window.innerHeight,
    facingMode: 'user',
    // deviceId: {
    //   // exact: 'a97af83648efa29ee34425992713f6d778abbf4a384bb26c1e78faca3bb4da71' // vcam
    //   exact: '9708bf02734d5a1d8ae2f6fb4c4c5e00b7472c0a12c02e60ae04ef36150b0d35' // OBS cam
    // },
    resizeMode: 'crop-and-scale',
  }
}

/**
 * 使用浏览器原生api调用摄像头
 * @param {MediaStreamConstraints} constraints 
 * @returns {Promise<MediaStream>}
 */
export const setupCameraBrowser = (constraints) => {
  constraints = constraints || DEFAULT_CONSTRAINTS
  return new Promise((resolve, reject) => {
    if (!navigator.mediaDevices) {
      log.err('Camera Error: access not supported');
      reject('Camera Error: access not supported')
    }
    navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => {
      log.succ('setup camera success')
      resolve(stream)
    })
    .catch(err => {
      const isPermissionDenied = err.message === 'Permission denied' || /NotAllowedError/.test(err);
      const errInfo = isPermissionDenied ? 'Permission denied' : err
      log.err(errInfo)
      reject(errInfo)
    })
  })
}

/**
 * 使用uni-app api调用摄像头
 * @param {Object} constraints 
 * @returns {Promise<MediaStream>}
 */
export const setupCameraUniApp = (constraints) => {
  return new Promise((resolve, reject) => {
    // TODO    
  })
}

export const showCameraList = () => {
  navigator.mediaDevices.enumerateDevices()
  .then(devices => {
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    console.log('可用的摄像头有：', videoDevices);
  })
  .catch(error => {
    console.error('获取媒体设备信息时出错：', error);
  });
}