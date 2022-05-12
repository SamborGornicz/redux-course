const Avatar = ({ image, name }) => (
  <div className="flex justify-end items-center">
    <img src={image} alt="avatar" className="w-10 h-10 object-cover object-center rounded-full" />
    {name && <p className="pl-2 text-lg font-semibold">{name}</p>}
  </div>
)

export default Avatar