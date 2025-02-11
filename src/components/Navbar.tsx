import React, {useEffect, useState} from 'react';
import { Link, useLocation } from 'react-router-dom';
import {useSelector} from "react-redux";
import { useDisconnect} from "wagmi";
import {truncateAddress} from "../utils/address.ts";
import store from "../store";
import {saveAccount} from "../store/reducer.ts";
import CloseImg from '../assets/images/close-circle.svg';
import {useSwitchNetwork} from 'wagmi';
import {USE_NETWORK} from "../utils/constant.ts";
import Chain from "../utils/chain.ts";
import '../styles/navbar.css';


const navigation = [
  { name: '首页', href: '/' },
  { name: '历史会议', href: '/archives' },
  { name: '关于节点大会', href: '/about' },
];

export default function Navbar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {disconnect} = useDisconnect();

  const {switchNetwork} =useSwitchNetwork()

  useEffect(() => {

    switchNetwork && switchNetwork(Chain[USE_NETWORK].chainId)
  }, [switchNetwork]);

  const account = useSelector((store:any) => store.account);

  const handleDisconnect = () => {
    disconnect()
    store.dispatch(saveAccount(null));
  }

  return (
    <nav className="navbar-custom sticky top-0 z-50 backdrop-blur-sm border-b border-white/20">
      <div className="container">
        <div className="flex h-20 items-center justify-between">
          <Link
            to="/"
            className="hover:opacity-80 transition-opacity"
          >
            <img
              src="https://app.seedao.xyz/static/media/logo.ff952187ebb322404b138c2c7b4629f8.svg"
              alt="SeeDAO Logo"
              className="h-[26px] w-auto"
            />
          </Link>

          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex items-center gap-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`nav-link ${location.pathname === item.href ? 'nav-link-active' : ''}`}
                >
                  <span>
                    {item.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            {!!account && (
              <div className="hidden gap-1 sm:flex">
                {truncateAddress(account)}
                <div className="cursor-pointer" onClick={()=>handleDisconnect()}>
                  <img src={CloseImg} alt=""/>
                </div>
              </div>
            )}
            <div className="md:hidden">
              <button
                className="btn btn-accent"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  {isMenuOpen ? (
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  ) : (
                    <path
                      fillRule="evenodd"
                      d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-4 py-2 rounded-lg transition-colors ${
                  location.pathname === item.href
                    ? 'text-[#6C63FF]'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {
                !!account && <div className="flex gap-1 border-t pt-4 content-center pl-2">
                  {truncateAddress(account)}
                  <div className="cursor-pointer" onClick={()=>handleDisconnect()}><img src={CloseImg} alt=""/></div>
                </div>
            }
          </div>

        </div>
      </div>
    </nav>
  );
}
