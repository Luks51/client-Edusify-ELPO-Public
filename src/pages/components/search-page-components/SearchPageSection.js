import React from "react";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { useParams } from "react-router-dom";

function SearchPageSection() {
  let serverApi = "";

  if (process.env.REACT_APP_MODE == "production") {
    serverApi = process.env.REACT_APP_SERVER_API
  } else {
    serverApi = process.env.REACT_APP_DEV_SERVER_API
  }

  const [listOfProjects, setListOfProjects] = useState([]);
  const { auth, setAuth } = useContext(AuthContext);
  const [loaded, setLoaded] = useState(0);
  const [loadBtn, setLoadBtn] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const search = () => {
    if (!(searchValue == "")) {
      navigate(`/search/${searchValue}`);
      window.scrollTo(0, 0);
      window.location.reload(false);
    }
  };

  const loadMore = () => {
    axios
      .post(
        `${serverApi}/projects/`,
        { loaded: loaded },
        { withCredentials: true }
      )
      .then((res) => {
        setListOfProjects([].concat(listOfProjects, res.data.rows));
        setLoaded(loaded + 24);
        if (res.data.rows.length < 3) {
          setLoadBtn(false);
        }
      });
  };

  const [error, setError] = useState({
    status: false,
    message: "",
  });

  let { query } = useParams();

  useEffect(() => {
    axios
      .post(
        `${serverApi}/projects/search/${query}`,
        { loaded: loaded },
        { withCredentials: true }
      )
      .then((res) => {
        if (!res.data.error) {
          setListOfProjects(res.data.rows);
          setLoaded(loaded + 24);
          if (res.data.rows.length < 3) {
            setLoadBtn(false);
          }
        } else {
          setError({
            status: true,
            message: res.data.error,
          });
        }
      });
  }, []);
  return (
    <>
      {" "}
      {!error.status ? (
        <section className="public-profile-section">
          <div className="container">
            <div className="search-content-wrapper">
              <div className="search-content">
                <input
                  type="text"
                  id="search"
                  name="search"
                  placeholder="Pretraži..."
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                  }}
                  onKeyPress={(event) => {
                    if (event.key === "Enter") {
                      search();
                    }
                  }}
                />
                <div className="search-icon-wrapper">
                  <img
                    className="search-icon-img"
                    src="../img/search-icon.png"
                    onClick={search}
                  />
                </div>
              </div>
            </div>
            <p className="project-section-label">Pretraži</p>
            <h3 className="learning-material-main-text">{query}</h3>
            {!(listOfProjects == "") ? (
              <div className="learning-material-grid">
                {listOfProjects.map((value, key) => {
                  if (value.visible == "1") {
                    return (
                      <div
                        key={key}
                        className="learning-material-single-item-wrapper"
                      >
                        <a
                          className="learning-material-single-item"
                          onClick={() => {
                            auth.status
                              ? navigate(`/project/${value.id}`)
                              : navigate("/login");
                          }}
                        >
                          <div className="single-item-img-wrapper">
                            <img
                              className="single-item-img"
                              src={`../img/single-item-img${value.photo}.svg`}
                            />
                          </div>
                          <div className="learning-material-single-item-content">
                            <h5 className="learning-material-single-item-heading">
                              {value.title}
                            </h5>
                            <p className="learning-material-single-item-description">
                              {value.description}
                            </p>
                            <a
                              onClick={() => {
                                auth.status
                                  ? navigate(`/profile/${value.User.username}`)
                                  : navigate("/login");
                              }}
                            >
                              <p>{value.User.username}</p>
                            </a>
                          </div>
                        </a>
                      </div>
                    );
                  }
                })}
              </div>
            ) : (
              <div className="my-projects-empty">
                <p className="my-projects-empty-text">Ništa nije nađeno</p>
              </div>
            )}
            {loadBtn && (
              <div>
                <a className="profile-data-make-changes-btn" onClick={loadMore}>
                  Učitaj više
                </a>
              </div>
            )}
          </div>
        </section>
      ) : (
        <section className="project-section">
          <div className="container">
            <p className="page-error">{error.message}</p>
          </div>
        </section>
      )}
    </>
  );
}

export default SearchPageSection;
