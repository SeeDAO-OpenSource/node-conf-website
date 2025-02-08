import styled from 'styled-components';
import CloseImg from '../../assets/images/close-circle.svg';

import {
  useConnect,
  useAccount,
  useChainId,
  ConnectorAlreadyConnectedError,
} from 'wagmi';
import { Connector } from 'wagmi/connectors';

import MetamaskIcon from '../../assets/images/METAmask.svg';
import WalletIcon from '../../assets/images/walletconnect.png';
import JoyIdImg from '../../assets/images/JOYID.png';
import { useEffect, useState } from 'react';

import {SELECT_WALLET, USE_NETWORK} from '../../utils/constant';
import CHAIN from "../../utils/chain.ts";
import {saveAccount} from "../../store/reducer.ts";
import store from "../../store";


enum CONNECTOR_ID {
  METAMASK = 'injected',
  JOYID = 'joyid',
  WALLETCONNECT = 'walletConnect',
}

 enum Wallet {
  METAMASK_INJECTED = 'METAMASK_INJECTED',
  METAMASK = 'METAMASK',
  JOYID = 'JOYID',
  JOYID_WEB = 'JOYID_WEB',
  WALLETCONNECT = 'WALLETCONNECT',
}



const getConnectorStatic = (id: CONNECTOR_ID): any => {
  switch (id) {
    case CONNECTOR_ID.METAMASK:
      return {
        icon: MetamaskIcon,

        wallet: Wallet.METAMASK_INJECTED,
      };
    case CONNECTOR_ID.JOYID:
      return {
        icon: JoyIdImg,

        wallet: Wallet.JOYID_WEB,
      };
      case CONNECTOR_ID.WALLETCONNECT:
      return {
        icon: WalletIcon,
        wallet: Wallet.WALLETCONNECT,
      };
  }
};

const LoginModalContent = ({handleClose}: { handleClose: () => void }) => {


  const { connectors, isLoading: connectLoading, connectAsync } = useConnect();
  const { isConnected, address } = useAccount();
  const chainId = useChainId();

  const [selectConnectorId, setSelectConnectorId] = useState<CONNECTOR_ID>();
  const [loginLoading, setLoginLoading] = useState(false);

  // const { showToast } = useToast();

  const [clickConnectFlag, setClickConnectFlag] = useState(false);


  useEffect(() => {
    store.dispatch(saveAccount(address));
  }, [address]);




  const closeModal = () => {
    handleClose()

    // dispatch({ type: AppActionType.SET_LOGIN_MODAL, payload: false });
  };

  const handleClickWallet = async (connector: Connector) => {
    if (connector.id === CONNECTOR_ID.METAMASK && !connector.ready) {
      // showToast("还没有钱包？去安装", ToastType.Danger);
      window.open('https://metamask.io/download.html', '_blank');
      return;
    } else if (!connector.ready) {
      // showToast( `${connector.name}钱包未准备好`), ToastType.Danger);
      return;
    }
    if (connector.id === CONNECTOR_ID.METAMASK && connector.name !== 'MetaMask') {
      // showToast(`请关闭浏览器插件${connector.name}, 使用MetaMask钱包`), ToastType.Danger);
      return;
    }

    localStorage.setItem(SELECT_WALLET, Wallet.METAMASK_INJECTED);
    setSelectConnectorId(connector.id as CONNECTOR_ID);

    // handle connect
    try {
      await connectAsync({ connector, chainId: CHAIN[USE_NETWORK].chainId });
      setClickConnectFlag(true);
    } catch (error: any) {
      if (error instanceof ConnectorAlreadyConnectedError) {
        if (isConnected && address) {
          setClickConnectFlag(true);
        }
      }
      console.log('=======', error, error.mesaage);
    }
    handleClose()
  };

  const getConnectorButtonText = (connector: Connector) => {
    if (connector.id === 'injected') {
      return 'MetaMask';
    }
    if (connector.ready) {
      return connector.name;
    }
    return 'Unsupport';
  };

  const getConnectionButtons = () => {
    return connectors.map((connector) => {
      return  (
        <WalletOption onClick={() => handleClickWallet(connector)} key={connector.id}>
          <img src={getConnectorStatic(connector.id as CONNECTOR_ID)?.icon} alt="" />
          <span>{getConnectorButtonText(connector)}</span>
        </WalletOption>
      );
    });
  };
  return (
    <Mask show={true}>
      <Modal>
        <span className="icon-close" onClick={() => closeModal()}>
          <img src={CloseImg} alt="" />
        </span>
        <Title>连接钱包</Title>
        {getConnectionButtons()}
        <InstallTip href="https://metamask.io/download/" target="_blank">
          还没有钱包？去安装 &gt;&gt;
        </InstallTip>
      </Modal>
    </Mask>
  );
};

export default function LoginModal({ showModal,handleClose }: { showModal?: boolean,handleClose: () => void }) {
  //   console.log('window.ethereum:', window.ethereum);
  if (showModal) {
    return <LoginModalContent handleClose={handleClose}  />;
  } else {
    return null;
  }
}

interface ShowProps {
  show: boolean;
}

const Mask = styled.div<ShowProps>`
  position: fixed;
  left: 0;
  top: 0;
  z-index: 99;
  width: 100vw;
  height: 100vh;
  background: rgba(255,255,255,0.7);
  //display: flex;
  display: ${(props) => (props.show ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
`;

const Modal = styled.div`
  width: 427px;
  /* min-height: 354px; */
  opacity: 1;
  border-radius: 16px;
  background: #fff;
  border: 1px solid #E9EBED;
  padding: 40px 65px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .icon-close {
    position: absolute;
    right: 10px;
    top: 5px;
    cursor: pointer;
    font-size: 24px;
  }
`;

const Title = styled.div`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 38px;
  color: #1A1323;
`;

const WalletOption = styled.li`
  display: flex;
  align-items: center;
  padding: 14px 28px;
  border-radius: 16px;
  margin-bottom: 16px;
  cursor: pointer;
  background: #F9F9F9;
  color:#1A1323;
  font-weight: 600;
  font-size: 16px;
  &:hover {
    background-color: #F8F5FF;
  }
  img {
    width: 32px;
    height: 32px;
    margin-right: 20px;
  }
`;

const InstallTip = styled.a`
  color: #5200FF;
  text-align: center;
  font-size: 12px;
`;
