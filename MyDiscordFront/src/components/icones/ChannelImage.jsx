import React from 'react';
import PropTypes from 'prop-types';
import './ChannelImage.css';

const ChannelImage = ({imageSrc, rounded}) => {
  return (
    <img src={imageSrc ?? "https://via.placeholder.com/150"} className='channelimage' />
  );
};

ChannelImage.propTypes = {
  imageSrc: PropTypes.string.isRequired,
};

export default ChannelImage;