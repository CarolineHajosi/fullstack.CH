import hamsterLogo from '../HamsterLogo.png'

const Start = () => (
  <div className="start">
    <p>Detta är en hamsterapp.</p>
    <p>För att börja spela tryck på "spela".</p>

    <img src={hamsterLogo} className="hamsterLogo" alt="hamsterLogo" />

    <p className="footer">
      Detta är en app utvecklad av Caroline Hajosi, FEU21 på IT-Högskolan.
    </p>
  </div>
)

export default Start
