export default function FAQ() {
  return (
    <div className='my-24 px-8 w-full'>
      <h1 className='text-4xl font-bold mb-4'>FAQ</h1>
      <FAQLine
        q='How do I join?'
        a='Just show up! This is a free and chill run club. Everyone is welcome!'
      />
      <FAQLine
        q='Where do you meet?'
        a='We meet every Thursday evening at 6PM at Tap & Handle'
      />
      <FAQLine
        q='Where do you run?'
        a='We run routes around downtown Fort Collins. Including through CSU campus and the Poudre Trail!'
      />
      <FAQLine
        q='How far do you run?'
        a='We usually run between 2 and 5 miles.'
      />
      <FAQLine
        q='Who is this club for?'
        a='Everyone! All skill levels are welcome, including pets and children!'
      />
      <FAQLine
        q='How many people are at the average club day?'
        a='We usually have between 12-30 people on any given day.'
      />
      <FAQLine
        q='How fast do you run?'
        a='However fast we want! There are groups at all speeds.'
      />
      <FAQLine
        q='Do I have to run the whole time?'
        a='
        Not at all! Run however fast you want, take breaks, or join the walking
        crew for the day!
      '
      />
      <FAQLine
        q="What's in it for me?"
        a='On top of exercise and befriending cool people, Tap and Handle gives us happy hour prices on drinks and food and if you log 8 runs with us you get an Old Town Run Club tech tee! We also get a discount at Tellus Outdoor Gear.'
      />
    </div>
  )
}

interface FAQProps {
  q: string
  a: string
}
const FAQLine: React.FC<FAQProps> = ({ q, a }) => {
  return (
    <div className='mb-8'>
      <h2 className='text-2xl sm:text-3xl mb-2 font-bold'>{q}</h2>
      <h3 className='text-xl sm:text-2xl'>{a}</h3>
    </div>
  )
}
