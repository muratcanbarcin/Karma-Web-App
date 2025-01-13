import { useState, useCallback, useEffect } from "react";

import styles from "./Karmaacom.module.css";

const Karmaacom = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [points, setPoints] = useState(null); // Points bilgisini tutuyoruz
  const [showLogin, setShowLogin] = useState(true);
  const openModal = useCallback(() => {
    setIsModalOpen(true);
    setShowLogin(true);
  }, []);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Eğer token varsa, points bilgisi çekilir
      fetch("http://localhost:3000/api/users/points", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch points.");
          }
          return response.json();
        })
        .then((data) => {
          setPoints(data.pointsBalance); // Points bilgisini state'e kaydet
        })
        .catch((error) => {
          console.error("Error fetching points balance:", error);
        });
    }
  }, []);


  // Modalı kapatan fonksiyon
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);
  const toggleFormToLogin = () => setShowLogin(true);
  const toggleFormToRegister = () => setShowLogin(false);

  const onHOMETextClick = useCallback(() => {
    const anchor = document.querySelector("[data-scroll-to='rectangle1']");
    if (anchor) {
      anchor.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  }, []);

  const onEXPLORETextClick = useCallback(() => {
    const anchor = document.querySelector(
      "[data-scroll-to='greenInteriorModernInteriorImage']"
    );
    if (anchor) {
      anchor.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  }, []);

  const onCONTACTTextClick = useCallback(() => {
    const anchor = document.querySelector(
      "[data-scroll-to='secondHomeImagePlaceholder']"
    );
    if (anchor) {
      anchor.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  }, []);

  const onEvaarrowIosForwardFillIconClick = useCallback(() => {
    const anchor = document.querySelector("[data-scroll-to='rectangle']");
    if (anchor) {
      anchor.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  }, []);

  return (
    <div className={styles.karmaacom}>
      <section className={styles.headerAndNavbar}>
        <div className={styles.vectorParent}>
          <img
            className={styles.frameChild}
            alt=""
            src="/rectangle-12.svg"
            data-scroll-to="rectangle1"
          />
          <h1 className={styles.karmaSustainableAccommodatioContainer}>
            <p className={styles.karma}>KARMA</p>
            <p className={styles.karma}>SUSTAINABLE ACCOMMODATION</p>
          </h1>
          <div className={styles.navigation}>
            <img
              className={styles.layerX00201Icon}
              alt=""
              src="/layer-x0020-1@2x.png"
            />
          </div>
        </div>
        <header className={styles.frameParent}>
  <div className={styles.rectangleParent}>
    <div className={styles.frameItem} />
    <img
      className={styles.treeHouse1Icon}
      loading="lazy"
      alt=""
      src="/treehouse-1@2x.png"
    />
  </div>
  <div className={styles.navBar}>
    {/* Sol grup (HOME, EXPLORE, CONTACT) */}
    <div className={styles.leftNav}>
      <button className={styles.navButton} onClick={onHOMETextClick}>
        HOME
      </button>
      <button className={styles.navButton} onClick={onEXPLORETextClick}>
        EXPLORE
      </button>
      <button className={styles.navButton} onClick={onCONTACTTextClick}>
        CONTACT
      </button>
    </div>

    {/* Sağ grup (POINTS, My Account) */}
    <div className={styles.rightNav}>
            {/* Kullanıcı giriş yapmışsa points'i göster */}
            {points !== null && (
              <div className={styles.pointsDisplay}>
                {`Points: ${points}`}
              </div>
            )}

      <button
        className={styles.myAccount}
        onClick={() => {
          const token = localStorage.getItem("token");
          if (token) {
            window.location.href = "/myaccount";
          } else {
            window.location.href = "/AuthForm";
          }
        }}
      >
        My Account
      </button>
    </div>
  </div>
</header>

        <div className={styles.liveLocalContentParent}>
          <div className={styles.liveLocalContent}>
            <div className={styles.liveLocalWrapper}>
              <button className={styles.liveLocalInner}>
                <div
                  className={styles.heroSubtitleBackground}
                  onClick={onEXPLORETextClick}
                />
                <b className={styles.liveLikeA}>LIVE LIKE A LOCAL</b>
              </button>
              <div className={styles.evaarrowIosForwardFillWrapper}>
                <img
                  className={styles.evaarrowIosForwardFillIcon}
                  loading="lazy"
                  alt=""
                  src="/evaarrowiosforwardfill.svg"
                  onClick={onEvaarrowIosForwardFillIconClick}
                />
              </div>
            </div>
          </div>
          
          <img
            className={styles.frameInner}
            loading="lazy"
            alt=""
            src="/group-7@2x.png"
          />
        </div>
      </section>
      <section className={styles.servicesContentWrapper}>
        <div className={styles.servicesContent}>
          <div className={styles.servicesInnerWrapper}>
            <div className={styles.servicesInner}>
              <div className={styles.servicesWrapper}>
                <h1 className={styles.services}>SERVICES</h1>
              </div>
              <div className={styles.freePointsBased}>
                Free Points Based Sustainable Accommodation
              </div>
            </div>
          </div>
          <div className={styles.frameGroup}>
            <div className={styles.frameWrapper}>
              <div className={styles.rectangleGroup}>
                <div className={styles.rectangleDiv} />
                <div className={styles.frameContainer}>
                  <div className={styles.frameDiv}>
                    <div className={styles.ellipseParent}>
                      <div className={styles.ellipseDiv} />
                      <img
                        className={styles.house1Icon}
                        loading="lazy"
                        alt=""
                        src="/house-1@2x.png"
                      />
                    </div>
                  </div>
                </div>
                <h2 className={styles.rentYourHomeContainer}>
                  <p className={styles.karma}>{`Rent Your Home `}</p>
                  <p className={styles.karma}>{`and `}</p>
                  <p className={styles.karma}>Earn Points</p>
                </h2>
              </div>
            </div>
            <div className={styles.rectangleContainer}>
              <div className={styles.frameChild1} />
              <div className={styles.bathValue}>
                <div className={styles.frameDiv}>
                  <div className={styles.ellipseParent}>
                    <div className={styles.townCircle} />
                    <img
                      className={styles.town1Icon}
                      loading="lazy"
                      alt=""
                      src="/town-1@2x.png"
                    />
                  </div>
                </div>
              </div>
              <h2 className={styles.rentAHouseContainer}>
                <p className={styles.karma}>{`Rent a House `}</p>
                <p className={styles.karma}>{`with `}</p>
                <p className={styles.karma}>Points</p>
              </h2>
            </div>
            <div className={styles.rectangleParent1}>
              <div className={styles.frameChild1} />
              <div className={styles.frameWrapper1}>
                <div className={styles.frameDiv}>
                  <div className={styles.ellipseParent}>
                    <div className={styles.townCircle} />
                    <img
                      className={styles.assets1Icon}
                      loading="lazy"
                      alt=""
                      src="/assets-1@2x.png"
                    />
                  </div>
                </div>
              </div>
              <h2 className={styles.karmaTokenComingContainer}>
                <p className={styles.karma}>{`Karma `}</p>
                <p className={styles.token}>{`Token  `}</p>
                <p className={styles.karma}>Coming Soon</p>
              </h2>
            </div>
          </div>
        </div>
      </section>
      <section className={styles.frameSection}>
        <div className={styles.greenInteriorModernInteriorParent}>
          <img
            className={styles.greenInteriorModernInteriorIcon}
            alt=""
            src="/greeninteriormoderninteriorlivingroomstylewithsoftsofagreenwall3drendering-2@2x.png"
            data-scroll-to="greenInteriorModernInteriorImage"
          />
          <div className={styles.groupDiv}>
            <div className={styles.liveLikeALocalWrapper}>
              <h1 className={styles.liveLikeA1}>LIVE LIKE A LOCAL</h1>
            </div>
            <div className={styles.rectangleParent3}>
                <div className={styles.frameChild5} />

                <button className={styles.search} onClick={() => (window.location.href = "/Search")}>
                  Search
                </button>

              </div>
          </div>
        </div>
        <div className={styles.rectangleParent4}>
          <div className={styles.frameChild6} data-scroll-to="rectangle" />
          <div className={styles.recommendationsTitle}>
            <h1 className={styles.homeRecommendationsFor}>
              Home Recommendations For You
            </h1>
          </div>
          <div className={styles.recommendationCards}>
            <div className={styles.rectangleParent5}>
              <div className={styles.frameChild7} />
              <div className={styles.cardInfo}>
                <div className={styles.cardInfoChild} />
                <img
                  className={styles.maskGroupIcon}
                  loading="lazy"
                  alt=""
                  src="/mask-group@2x.png"
                />
                <div className={styles.cardDetails}>
                  <div className={styles.cardFeatures}>
                    <div className={styles.cardFeatureIcons}>
                      <div className={styles.idr200000000}>---KT 774---</div>
                      <div className={styles.jlSoekarnoHatta}>
                        Davidport
                      </div>
                      <div className={styles.sewa}>Lisa</div>
                    </div>
                    <div className={styles.bedroomInfoParent}>
                      <div className={styles.bedroomInfo}>
                        <div className={styles.bedroomCount}>
                          <img
                            className={styles.mdibedIcon}
                            loading="lazy"
                            alt=""
                            src="/mdibed.svg"
                          />
                          <div className={styles.bedroomNumber}>
                            <div className={styles.div}>3</div>
                          </div>
                        </div>
                        <div className={styles.bathroomCount}>
                          <img
                            className={styles.faSolidbathIcon}
                            alt=""
                            src="/fasolidbath.svg"
                          />
                          <div className={styles.bathroomNumber}>
                            <div className={styles.bathroomCount1}>4</div>
                          </div>
                        </div>
                        <div className={styles.bedroomCount}>
                          <img
                            className={styles.fluentglobeSurface20FilledIcon}
                            loading="lazy"
                            alt=""
                            src="/fluentglobesurface20filled.svg"
                          />
                          <div className={styles.bedroomNumber}>
                            <div className={styles.m}>360m</div>
                          </div>
                        </div>
                      </div>
                      <div className={styles.houseSpecLabel}>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.rectangleParent6}>
              <div className={styles.frameChild7} />
              <div className={styles.div1}>3</div>
              <div className={styles.rectangleParent7}>
                <div className={styles.frameChild9} />
                <div className={styles.maskGroupWrapper}>
                  <img
                    className={styles.maskGroupIcon1}
                    alt=""
                    src="/mask-group-1@2x.png"
                  />
                </div>
                <div className={styles.frameParent2}>
                  <div className={styles.frameWrapper4}>
                    <div className={styles.idr200000000Parent}>
                      <div className={styles.idr200000000}>---KT 535---</div>
                      <div className={styles.jlSoekarnoHatta}>
                        North Travis
                      </div>
                      <div className={styles.jualWrapper}>
                        <div className={styles.jual}>Tracy</div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.houseInfoCard}>
                    <div className={styles.houseInfoCardChild} />
                    <div className={styles.infoCardContent}>
                      <div className={styles.mdibedWrapper}>
                        <img
                          className={styles.mdibedIcon1}
                          alt=""
                          src="/mdibed.svg"
                        />
                      </div>
                      <div className={styles.bathroomCount}>
                        <img
                          className={styles.faSolidbathIcon1}
                          alt=""
                          src="/fasolidbath.svg"
                        />
                        <div className={styles.bathroomNumber}>
                          <div className={styles.bathroomCountPlaceholder}>
                            4
                          </div>
                        </div>
                      </div>
                      <div className={styles.bedroomCount}>
                        <img
                          className={styles.fluentglobeSurface20FilledIcon1}
                          alt=""
                          src="/fluentglobesurface20filled.svg"
                        />
                        <div className={styles.bedroomNumber}>
                          <div className={styles.m1}>360m</div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.houseSpecLabel}>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.rectangleParent6}>
              <div className={styles.frameChild7} />
              <div className={styles.rectangleParent9}>
                <div className={styles.cardInfoChild} />
                <img
                  className={styles.maskGroupIcon2}
                  alt=""
                  src="/mask-group-2@2x.png"
                />
                <div className={styles.frameWrapper5}>
                  <div className={styles.cardFeatures}>
                    <div className={styles.cardFeatureIcons}>
                      <div className={styles.idr200000000}>---KT 687---</div>
                      <div className={styles.jlSoekarnoHatta}>
                        North Emilyburgh
                      </div>
                      <div className={styles.propertyBaru}>Barbara</div>
                    </div>
                    <div className={styles.bedroomInfoParent}>
                      <div className={styles.bedroomInfo}>
                        <div className={styles.bedroomCount}>
                          <img
                            className={styles.mdibedIcon}
                            alt=""
                            src="/mdibed.svg"
                          />
                          <div className={styles.bedroomNumber}>
                            <div className={styles.div}>3</div>
                          </div>
                        </div>
                        <div className={styles.bathroomCount}>
                          <img
                            className={styles.faSolidbathIcon}
                            alt=""
                            src="/fasolidbath.svg"
                          />
                          <div className={styles.bathroomNumber}>
                            <div className={styles.bathroomCount1}>4</div>
                          </div>
                        </div>
                        <div className={styles.bedroomCount}>
                          <img
                            className={styles.fluentglobeSurface20FilledIcon}
                            alt=""
                            src="/fluentglobesurface20filled-2.svg"
                          />
                          <div className={styles.bedroomNumber}>
                            <div className={styles.m}>360m</div>
                          </div>
                        </div>
                      </div>
                      <div className={styles.houseSpecLabel}>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.rectangleParent6}>
              <div className={styles.frameChild12} />
              <div className={styles.rectangleParent11}>
                <div className={styles.cardInfoChild} />
                <img
                  className={styles.maskGroupIcon3}
                  alt=""
                  src="/mask-group-3@2x.png"
                />
                <div className={styles.frameWrapper6}>
                  <div className={styles.cardFeatures}>
                    <div className={styles.cardFeatureIcons}>
                      <div className={styles.idr2000000003}>
                        ---KT 421---
                      </div>
                      <div className={styles.jlSoekarnoHatta3}>
                        South Michaelfort
                      </div>
                      <div className={styles.sewa1}>Joseph </div>
                    </div>
                    <div className={styles.bedroomInfoParent}>
                      <div className={styles.bedroomInfo}>
                        <div className={styles.bedroomCount}>
                          <img
                            className={styles.fluentglobeSurface20FilledIcon1}
                            alt=""
                            src="/mdibed.svg"
                          />
                          <div className={styles.bedroomNumber}>
                            <div className={styles.div4}>3</div>
                          </div>
                        </div>
                        <div className={styles.bathroomCount}>
                          <img
                            className={styles.faSolidbathIcon3}
                            alt=""
                            src="/fasolidbath.svg"
                          />
                          <div className={styles.bathroomNumber}>
                            <div className={styles.div5}>4</div>
                          </div>
                        </div>
                        <div className={styles.bedroomCount}>
                          <img
                            className={styles.fluentglobeSurface20FilledIcon1}
                            alt=""
                            src="/fluentglobesurface20filled.svg"
                          />
                          <div className={styles.bedroomNumber}>
                            <div className={styles.m3}>360m</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.rectangleParent6}>
              <div className={styles.frameChild7} />
              <div className={styles.rectangleParent13}>
                <div className={styles.cardInfoChild} />
                <img
                  className={styles.maskGroupIcon2}
                  alt=""
                  src="/mask-group-4@2x.png"
                />
                <div className={styles.frameWrapper7}>
                  <div className={styles.cardFeatures}>
                    <div className={styles.cardFeatureIcons}>
                      <div className={styles.idr200000000}>---KT 932---</div>
                      <div className={styles.jlSoekarnoHatta}>
                        Barbaramouth                      </div>
                      <div className={styles.sewa}>Mary </div>
                    </div>
                    <div className={styles.bedroomInfoParent}>
                      <div className={styles.bedroomInfo}>
                        <div className={styles.bedroomCount}>
                          <img
                            className={styles.mdibedIcon}
                            alt=""
                            src="/mdibed.svg"
                          />
                          <div className={styles.bedroomNumber}>
                            <div className={styles.div}>3</div>
                          </div>
                        </div>
                        <div className={styles.bathroomCount}>
                          <img
                            className={styles.faSolidbathIcon}
                            alt=""
                            src="/fasolidbath.svg"
                          />
                          <div className={styles.bathroomNumber}>
                            <div className={styles.bathroomCount1}>4</div>
                          </div>
                        </div>
                        <div className={styles.bedroomCount}>
                          <img
                            className={styles.fluentglobeSurface20FilledIcon}
                            alt=""
                            src="/fluentglobesurface20filled.svg"
                          />
                          <div className={styles.bedroomNumber}>
                            <div className={styles.m}>360m</div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.rectangleParent6}>
              <div className={styles.frameChild7} />
              <div className={styles.rectangleParent13}>
                <div className={styles.cardInfoChild} />
                <img
                  className={styles.maskGroupIcon2}
                  alt=""
                  src="/mask-group-5@2x.png"
                />
                <div className={styles.frameWrapper7}>
                  <div className={styles.cardFeatures}>
                    <div className={styles.cardFeatureIcons}>
                      <div className={styles.idr200000000}>---KT 259---</div>
                      <div className={styles.jlSoekarnoHatta}>
                        Josephmouth
                      </div>
                      <div className={styles.sewa}>Tracy</div>
                    </div>
                    <div className={styles.bedroomInfoParent}>
                      <div className={styles.bedroomInfo}>
                        <div className={styles.bedroomCount}>
                          <img
                            className={styles.mdibedIcon}
                            alt=""
                            src="/mdibed.svg"
                          />
                          <div className={styles.bedroomNumber}>
                            <div className={styles.div}>3</div>
                          </div>
                        </div>
                        <div className={styles.bathroomCount}>
                          <img
                            className={styles.faSolidbathIcon}
                            alt=""
                            src="/fasolidbath.svg"
                          />
                          <div className={styles.bathroomNumber}>
                            <div className={styles.bathroomCount1}>4</div>
                          </div>
                        </div>
                        <div className={styles.bedroomCount}>
                          <img
                            className={styles.fluentglobeSurface20FilledIcon}
                            alt=""
                            src="/fluentglobesurface20filled-2.svg"
                          />
                          <div className={styles.bedroomNumber}>
                            <div className={styles.m}>360m</div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className={styles.seeMoreButton}>
        <button
          className={styles.seeMore}
          onClick={() => (window.location.href = "/Search")}
        >
          See More...
        </button>
      </div>

      <section className={styles.maskGroupParent}>
        <img
          className={styles.maskGroupIcon10}
          alt=""
          src="/mask-group-10@2x.png"
        />
        <div
          className={styles.secondHomeImagePlaceholder}
          data-scroll-to="secondHomeImagePlaceholder"
        />
        <div className={styles.consultationContentWrapper}>
          <div className={styles.consultationContent}>
            <div className={styles.needConsultationPleaseCoWrapper}>
              <h1 className={styles.needConsultationPleaseContainer}>
                <p className={styles.karma}>Need Consultation..?</p>
                <p className={styles.karma}>Please contact us</p>
                <p className={styles.karma}>We are ready to help</p>
              </h1>
            </div>
            <div className={styles.contactButtonContainer}>
              <div className={styles.contactButton}>
                <div className={styles.contact1}>Contact</div>
                <div className={styles.contactButtonInner}>
                  <div className={styles.frameParent15}>
                    <div className={styles.frameParent16}>
                      <div className={styles.vectorContainer}>
                        <img
                          className={styles.vectorIcon3}
                          alt=""
                          src="/vector-3.svg"
                        />
                      </div>
                      <img
                        className={styles.groupIcon}
                        loading="lazy"
                        alt=""
                        src="/group.svg"
                      />
                      <img
                        className={styles.contactInfoIcon}
                        alt=""
                        src="/vector-4.svg"
                      />
                    </div>
                    <div className={styles.locationAndEmail}>
                      <div className={styles.bornovazmr}>
                        <p className={styles.karma}>Bornova/İZMİR</p>
                      </div>
                      <div className={styles.emailContainer}>
                        <div className={styles.bornovazmr}>
                          <p className={styles.karma}>123-456-7890</p>
                        </div>
                        <div className={styles.bornovazmr}>info@karmaa.com</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.socialMediaHeaderParent}>
              <div className={styles.socialMediaHeader}>
                <div className={styles.socialMedia}>Social Media</div>
              </div>
              <div className={styles.socialMediaIcons}>
                <div className={styles.instagramIconContainer}>
                  <img
                    className={styles.instagramIcon}
                    alt=""
                    src="/vector-5.svg"
                  />
                </div>
                <div className={styles.instagramIconContainer1}>
                  <img
                    className={styles.groupIcon1}
                    alt=""
                    src="/group-1.svg"
                  />
                </div>
                <img
                  className={styles.akarIconsinstagramFill}
                  loading="lazy"
                  alt=""
                  src="/akariconsinstagramfill.svg"
                />
                <div className={styles.bathroomNumber}>
                  <div className={styles.karmaa}>karmaa</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.rectangleParent17}>
          <div className={styles.frameChild20} />
          <div className={styles.frameWrapper9}>
            <form className={styles.questionPromptParent}>
              <div className={styles.questionPrompt}>
                <h1 className={styles.anyQuestion}>{`Any Question..? `}</h1>
              </div>
              <input
                className={styles.formFields}
                placeholder="Email"
                type="text"
              />
              <input
                className={styles.formFields}
                placeholder="Context"
                type="text"
              />
              <button
                className={styles.formFields2}
                onClick={() => alert("İletiniz başarıyla gönderildi! En yakın sürede geri dönüş yapacağız")}
              >
                <div className={styles.formFieldsChild} />
                <div className={styles.send}>Send</div>
              </button>

            </form>
          </div>
        </div>
      </section>
      <footer className={styles.frameFooter}>
        <div className={styles.frameChild21} />
        <div className={styles.rectangleParent18}>
          <div className={styles.frameItem} />
          <img
            className={styles.treeHouse1Icon1}
            alt=""
            src="/treehouse-1@2x.png"
          />
        </div>
        <div className={styles.copyright}>
          <div className={styles.copyrightByDeu}>
            Copyright by Deu Ceng Software
          </div>
        </div>
      </footer>
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
           

          

            
          </div>
        </div>
      )}
    </div>
  );
};

export default Karmaacom;
