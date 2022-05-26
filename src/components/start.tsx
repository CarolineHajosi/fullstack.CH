import hamsterLogo from '../HamsterLogo.jpg'
import Gulligast from './gulligast'

const Start = () => {
  return (
    <div className="start">
      <h3>Detta är en hamsterapp.</h3>
      <p>
        Här kan du ställa två gulliga hamstrar emot varandra i rafflande
        matcher.
        <br />
        Detta gör du genom att klicka på knappen "spela".
      </p>
      <p>
        Du kan också se alla hamstrar som finns i denna app, se deras stats och
        titta på deras gulliga bilder.
        <br />
        Det gör du genom att klicka på knappen "galleri".
      </p>

      <img src={hamsterLogo} className="myHamsterImg" />
      <br />

      <h3>Detta är hamstern med flest vinster just nu</h3>
      <Gulligast />

      <br />
      <p className="footer">
        Detta är en app utvecklad av Caroline Hajosi, FEU21 på IT-Högskolan.
      </p>
    </div>
  )
}

export default Start
