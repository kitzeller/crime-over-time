import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import LineC from './LineChart';
import LineA from './LineChartAbortion';
import PollutionCloudMap from './PollutionCloudMap';

class App extends Component {
    render() {
        return (
            <div className="App">
                <div className="heading">
                    <h1>Crime Over Time</h1>
                    <h2>An Investigation of Crime in the US from 1960 - 2014</h2>
                    <h3>Jacob Kapan and Kit Zellerbach</h3>
                    <div className="container">It is interesting to see what external factors drive human behavior,
                        especially when it drives
                        someone to do something drastic (commit crimes). This visualization allows
                        users to explore the co-occurrence of reduced crime rates with birth control and unleaded
                        gasoline.
                    </div>
                </div>
                <div className="section">
                    <h2>The Lead Problem</h2>
                    <p>Tetraethyllead (commonly styled tetraethyl lead), abbreviated TEL, is an organolead compound. TEL
                        is a petro-fuel additive, first being mixed with gasoline (petrol)
                        beginning in the 1920s as a patented octane rating booster that allowed engine compression to be
                        raised substantially. This in turn caused increased vehicle performance and fuel economy. TEL
                        levels in automotive fuel were reduced in the 1970s under the U.S. Clean Air Act in two
                        overlapping programs: to protect catalytic converters, which mandated unleaded gasoline for
                        those vehicles; and to protect public health, which mandated lead reductions in annual phases
                        (the "lead phasedown").<a
                            href="https://en.wikipedia.org/wiki/Tetraethyllead"><sup>[1]</sup></a></p>
                    <p>The visualization below shows...</p>
                </div>
                <PollutionCloudMap/>
                <div className="section">
                    <h2>Lead–crime hypothesis</h2>
                    <div className="row">
                        <div className="column-large">
                            <p>The lead–crime hypothesis is the proposed link between elevated blood lead levels in
                                children and
                                increased rates of crime, delinquency, and recidivism later in life. The lead-crime
                                hypothesis
                                arose out of the confluence of several events, primarily the decrease in crime rates in
                                the
                                1990s and the reduction of environmental lead pollution in the 1970s.<a
                                    href="https://en.wikipedia.org/wiki/Lead%E2%80%93crime_hypothesis"><sup>[2]</sup></a>
                            </p>
                            <p>Hover over the lines to highlight states! You can also click on a line to only display
                                that
                                state. Double-click to reset the graph.</p>
                            <p>Crime rates are in <span style={{color: "red"}}>red</span> and lead rates are in <span
                                style={{color: "grey"}}>grey.</span></p>
                        </div>
                        <div className="column-small">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Gas_pump_lead_warning.jpg/300px-Gas_pump_lead_warning.jpg"></img>
                        </div>
                    </div>

                </div>
                <LineC/>
                <div className="section">
                    <h2>Legalized abortion and crime effect</h2>
                    <div className="row">
                        <div className="column">
                            <p>The effect of legalized abortion on crime (also the Donohue–Levitt hypothesis) is a
                                hypothesized
                                controversial reduction in crime in the decades following the legalization of abortion,
                                as a
                                result of fewer children at the highest risk of committing crime being born due to the
                                availability of the procedure.
                            </p>
                            <p>
                                The 1972 Rockefeller Commission on "Population and the American Future" cites a 1966
                                study which found that children born to women who had been denied an abortion "turned
                                out to have been registered more often with psychiatric services, engaged in more
                                antisocial and criminal behavior, and have been more dependent on public assistance."
                            </p>
                            <p>
                                Donohue and Levitt suggest that the absence of unwanted children, following legalization
                                in
                                1973, led to <b>a reduction in crime 18 years later</b>, starting in 1992 and dropping
                                sharply
                                in 1995.
                                These would have been the peak crime-committing years of the unborn children.<a
                                href="https://en.wikipedia.org/wiki/Legalized_abortion_and_crime_effect"><sup>[3]</sup></a>
                            </p>
                        </div>
                        <div className="column">
                            <img style={{"maxWidth": "85%", "maxHeight": "85%", margin: "15px"}}
                                 src="https://timedotcom.files.wordpress.com/2015/01/anti-abortion-rally.jpeg"></img>
                        </div>
                    </div>
                    <p>This visualization below shows the trends in abortion rates and crimes. You can see than
                        approximately 18 years after
                        abortion was legalized, crime levels rapidly decline. Double click the chart to shift crime
                        rates back by 18 years and
                        see the correlation.</p>
                    <p>Crime rates are in <span style={{color: "red"}}>red</span> and abortion rates are in <span
                        style={{color: "grey"}}>grey.</span></p>
                </div>
                <LineA/>
                <div className="section">
                    <h2>Summary</h2>
                    <p>We explored some hypothesised explanations of the drop in US crime rates using interactive
                        visualizations. Namely, lead poisoning and the legalization of abortion policies.</p>
                </div>
                <div className="footing">
                    <h2>Credits</h2>
                    <p>This project was created by Jacob Kaplan and Kit Zellerbach for a undergraduate course in Data
                        Visualization at <a href="https://www.wpi.edu/>">WPI</a> taught by Professor Lane Harrison.</p>
                    <p>This website was created using React and D3.js</p>
                    <p>Data was obtained from public online sources, such as UCR Data Online, Guttmacher Institute,
                        and State Energy Data System (SEDS).</p>
                </div>
            </div>
        );
    }
}

export default App;
