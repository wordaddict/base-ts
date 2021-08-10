import express from 'express'
import multer, { Multer } from 'multer'

import { serviceLocate } from '../config/di'
import { SubtitleController as SubtitleControllerIdentifier } from '../controllers';
import { TMSController as TMSControllerIdentifier } from '../controllers'

export const upload = multer({ dest: 'uploads/' })

// SET STORAGE FOR SUBTITLE
const storage = multer.diskStorage({
  destination: function (req: express.Request, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.txt')
  },
})

const uploadSubtitle = multer({ storage: storage });

export const SubtitleController: SubtitleControllerIdentifier = serviceLocate.get(
  'subtitleController'
)

export const TMSController: TMSControllerIdentifier = serviceLocate.get(
  'tmsController'
)


export const router = express.Router()

router.post('/upload_subtitle', uploadSubtitle.single('subtitle'), (req, res) => {
  return SubtitleController.addSubtitle(req, res)
})

// TMS

// store translation
router.post('/store_translation', (req, res) => {
  return TMSController.uploadTranstion(req, res)
})

// get translation
router.get('/translation', (req, res) => {
  return TMSController.getTranstion(req, res)
})
