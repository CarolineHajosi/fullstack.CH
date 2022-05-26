import { atom, RecoilState } from 'recoil'

const AtomHamster: RecoilState<any> = atom({
  key: 'AtomHamster',
  default: [],
})

export default AtomHamster
