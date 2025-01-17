import React, { useContext, useState, useEffect } from 'react';
import { IRouteComponentProps } from '@umijs/types';
import { context, Link } from 'dumi/theme';
import Navbar from 'dumi-theme-default/src/components/Navbar';
import SideMenu from 'dumi-theme-default/src/components/SideMenu';
import SlugList from 'dumi-theme-default/src/components/SlugList';
import SearchBar from 'dumi-theme-default/src/components/SearchBar';
import { Popover } from 'antd';
import Notice from './Notice';
import './style/layout.less';

const Hero = hero => (
  <>
    <div className="__dumi-default-layout-hero">
      {hero.image && <img src={hero.image} />}
      <h1>{hero.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: hero.desc }} />
      {hero.actions &&
        hero.actions.map(action => (
          <Link to={action.link} key={action.text}>
            <button type="button">{action.text}</button>
          </Link>
        ))}
    </div>
  </>
);

const WaimaiBanner = () => (
  <div className="waimai-banner">
    <Popover
      placement="bottom"
      content={
        <>
          <p style={{ textAlign: 'center' }}>天天有点券</p>
          <img
            src="/images/mini-waimai.jpg"
            style={{ height: '129px', width: '129px' }}
          />
        </>
      }
      trigger="hover"
    >
      <img className="waimai-banner-img" src="/images/waimai-banner.png" />
      <img
        className="waimai-banner-tiny-img"
        src="/images/waimai-banner-sm.png"
      />
    </Popover>
  </div>
);

const Features = features => (
  <div className="__dumi-default-layout-features">
    {features.map(feat => (
      <dl
        key={feat.title}
        style={{ backgroundImage: feat.icon ? `url(${feat.icon})` : undefined }}
      >
        {feat.link ? (
          <Link to={feat.link}>
            <dt>{feat.title}</dt>
          </Link>
        ) : (
          <dt>{feat.title}</dt>
        )}
        <dd dangerouslySetInnerHTML={{ __html: feat.desc }} />
      </dl>
    ))}
  </div>
);

const Layout: React.FC<IRouteComponentProps> = ({ children, location }) => {
  const {
    config: { mode, repository },
    meta,
    locale,
  } = useContext(context);
  const { url: repoUrl, branch, platform } = repository;
  const [menuCollapsed, setMenuCollapsed] = useState<boolean>(true);
  const isSiteMode = mode === 'site';
  const showHero = isSiteMode && meta.hero;
  const showFeatures = isSiteMode && meta.features;
  const showSideMenu =
    meta.sidemenu !== false && !showHero && !showFeatures && !meta.gapless;
  const showSlugs =
    !showHero &&
    !showFeatures &&
    Boolean(meta.slugs?.length) &&
    (meta.toc === 'content' || meta.toc === undefined) &&
    !meta.gapless;
  const isCN = /^zh|cn$/i.test(locale);
  const updatedTime: any = new Date(meta.updatedTime).toLocaleString([], {
    hour12: false,
  });
  const repoPlatform =
    { github: 'GitHub', gitlab: 'GitLab' }[
      (repoUrl || '').match(/(github|gitlab)/)?.[1] || 'nothing'
    ] || platform;

  return (
    <div
      className="__dumi-default-layout"
      data-route={location.pathname}
      data-show-sidemenu={String(showSideMenu)}
      data-show-slugs={String(showSlugs)}
      data-site-mode={isSiteMode}
      data-gapless={String(!!meta.gapless)}
      onClick={() => {
        if (menuCollapsed) return;
        setMenuCollapsed(true);
      }}
    >
      <Navbar
        location={location}
        navPrefix={
          <div style={{ display: 'inline-block' }}>
            <SearchBar />
          </div>
        }
        onMobileMenuClick={ev => {
          setMenuCollapsed(val => !val);
          ev.stopPropagation();
        }}
      />
      <SideMenu mobileMenuCollapsed={menuCollapsed} location={location} />
      {showSlugs && (
        <SlugList slugs={meta.slugs} className="__dumi-default-layout-toc" />
      )}
      {showHero && Hero(meta.hero)}
      {showFeatures && Features(meta.features)}
      <div className="__dumi-default-layout-content">
        {children}
        {!showHero && !showFeatures && meta.filePath && !meta.gapless && (
          <>
            <div className="__dumi-default-layout-footer-meta">
              {repoPlatform && (
                <Link to={`${repoUrl}/edit/${branch}/${meta.filePath}`}>
                  {isCN
                    ? `在 ${repoPlatform} 上编辑此页`
                    : `Edit this doc on ${repoPlatform}`}
                </Link>
              )}
              <span
                data-updated-text={isCN ? '最后更新时间：' : 'Last update: '}
              >
                {updatedTime}
              </span>
            </div>
            {/*<ValineComment location={location} />*/}
          </>
        )}
        {(showHero || showFeatures) && meta.footer && (
          <div
            className="__dumi-default-layout-footer"
            dangerouslySetInnerHTML={{ __html: meta.footer }}
          />
        )}
      </div>
      {!showHero && !showFeatures && meta.filePath && !meta.gapless && (
        <Notice />
      )}
    </div>
  );
};

export default Layout;
