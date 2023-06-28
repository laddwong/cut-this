/*
 * 1. 初始化摄像头，视频流
 * 2. 加载模型 
 * 3. 避免重复加载
 */
import { log } from "../utils/log";
import { setupCameraBrowser } from "../utils/setupCamera";
import * as faceapi from '@vladmandic/face-api';

const DEF_MODEL_DIR_PATH = '../model/'

/**
 * 目标检测器
 */
export class Detector {
  constructor({videoEl, onInitSuccess, onInitFail}) {
    this.modelPath = DEF_MODEL_DIR_PATH;
    /** @type {HTMLVideoElement} */this.videoEl = videoEl;
    /** @type {Function} 初始化成功回调 */this.onInitSuccess = onInitSuccess;
    /** @type {Function} 初始化失败回调 */this.onInitFail = onInitFail;
    /** @type {boolean} 是否初始化成功 */this.isInitSuccess;
    /** @type {boolean} 是否初始化失败 */this.isInitFailed;
    /** @type {Function} 检测到目标回调 */this.onDetectCallBack;
    /** @type {boolean} 是否正在检测目标 */this.isDetecting;
    this.faceDetectionOptions;

    this.init()
  }
  /**
   * 初始化
   */
  init() {
    this.isInitSuccess = this.isInitFailed = false;
    Promise.all([
      this.initVideo(), 
      this.initFaceAPI()
    ])
    .then(() => {
      this.onInited()
    })
    .catch(err => {
      log.err('detector onInitFail', err)
      this.onInitFail()
    })
  }
  /**
   * 开始检测目标
   */
  start() {
    this.isDetecting = true
    this.detectNose()
  }
  /**
   * 停止检测目标
   */
  stop() {
    this.isDetecting = false
  }
  detectNose() {
    faceapi
    .detectSingleFace(this.videoEl, this.faceDetectionOptions)
    .withFaceLandmarks()
    .then(result => {
      if(result && result.landmarks) {
        const noseLandMarks = result.landmarks.getNose()
        const noseCenterPos = [noseLandMarks[6].x, noseLandMarks[6].y]
        this.onDetectCallBack && this.onDetectCallBack(noseCenterPos)
      }
    })
    .catch(err => {
      log.err('face-api detect failed', err)
    })
    .finally(() => {
      this.isDetecting && requestAnimationFrame(() => this.detectNose())
    })
  }
  onDetect(callBack) {
    this.onDetectCallBack = callBack
    return this
  }
  onInited() {
    this.isInitSuccess = true
    this.onInitSuccess && this.onInitSuccess()
  }
  onInitFail() {
    this.isInitFailed = true
    this.onInitFail && this.onInitFail()
  }
  /**
   * @returns {Promise<faceapi.SsdMobilenetv1Options>}
   */
  initFaceAPI() {
    const MIN_SCORE = 0.2; 
    const MAX_RESULTS = 5;
    const YOLO_INPUT_SIZE = 224;
    return new Promise((resolve, reject) => {
      Promise.all([
        faceapi.nets.tinyFaceDetector.load(this.modelPath),
        // faceapi.nets.ssdMobilenetv1.load(this.modelPath),
        faceapi.nets.faceLandmark68Net.load(this.modelPath),
      ])
      .then(() => {
        // this.faceDetectionOptions = new faceapi.SsdMobilenetv1Options({ minConfidence: MIN_SCORE, maxResults: MAX_RESULTS })
        this.faceDetectionOptions = new faceapi.TinyFaceDetectorOptions({inputSize: YOLO_INPUT_SIZE, scoreThreshold: MIN_SCORE})
        resolve(this.faceDetectionOptions)
        log.succ('init face api success')
      })
      .catch(err => {
        log.err(`init face api fail ${JSON.stringify(err)}`)
        reject()
      })
    })
  }
  /**
   * 初始化摄像头，视频流
   * @returns {Promise<HTMLElement>}
   */
  initVideo() {
    return new Promise((resolve, reject) => {
      setupCameraBrowser()
      .then(stream => {
        // TODO：裁剪视频流
        // 加载视频流到video标签
        this.videoEl.onloadeddata = () => {
          this.videoEl.play()
          log.info('video origin size: ', this.videoEl.videoWidth, this.videoEl.videoHeight)
          resolve(this.videoEl)
          log.succ('init video success!!')
        }
        this.videoEl.srcObject = stream
      })
      .catch(err => {
        log.err('init video err', err)
        reject()
      })
    })
  }
}