// project-imports
import Hero from 'sections/landing/Hero';
import Statistics from 'sections/landing/Statistics';
import WhoWeAreSection from 'sections/landing/WhoWeAreSection';
import Contacts from 'sections/landing/Contacts';
import Download from 'sections/landing/Download';
import Faq from 'sections/landing/faq';
import FileLoadingStatistic from 'sections/landing/fileLoadingStatistic';

// ==============================|| SAMPLE PAGE ||============================== //

export default function Landing() {
  return (
    <>
      <div style={{ overflow: 'hidden', width: '100%', maxWidth: '100vw' }}>
        <Hero />
        <Statistics />
        <FileLoadingStatistic />
        <WhoWeAreSection />
        <Download />
        <Contacts />
        <Faq />
        {/* <Partners /> */}
      </div>
    </>
  );
}
